'use strict';
var request = require('superagent');
var cheerio = require('cheerio');
var config = require('./config');
var Question = require('./question');
var Topic = require('./topic');

function sendQuestionRequest(time) {
	let url = 'http://api.kanzhihu.com/getpostanswers/' + time + '/recent';
	let p = new Promise( (resolve, reject) => {
		request.get(url)
		.end((err, res) => {
			if (err) {
				reject(err);
				return;
			}
			let json;
			try {
				json = JSON.parse(res.text);
				if (json.error && json.error != '') {
					reject(json.error);
					return;
				}
			} catch (e) {
				reject(e);
				return;
			}
			resolve(json.answers);
		})
	})
	return p;
}

function getTopic(questionID) {
	let url = 'https://www.zhihu.com/question/' + questionID;
	let topicTag = '.zm-item-tag';
	let followTag = '#zh-question-side-header-wrap';
	let p = new Promise( (resolve, reject) => {
		request.get(url)
		.end( (err, res) => {
			if (err) {
				reject(err);
				return;
			}
			let $ = cheerio.load(res.text);
			let topicArr = [];
			$(topicTag).each( (i, elem) => {
				let v = $(elem);
				let name = v.text().replace(/\n/g, '');
				let id = parseInt(v.attr('href').replace('/topic/', ''));
				topicArr.push({
					name: name,
					id: id
				});
			});

			let followNum = $(followTag).text().match(/\d/g);
			if (followNum == null) {
				followNum = 0;
			} else {
				followNum = parseInt(followNum.join(''));
			}
			resolve({
				topicArr: topicArr,
				followNum: followNum
			});
		})
	});
	return p;
}

function getQuestion(time) {
	sendQuestionRequest(time).then( (res) => {
		console.log(time, " load");
		let sleepOffset = 0;
		res.forEach( (question) => {
			setTimeout( () => {
				let topicStringP = getTopic(question.questionid);
				topicStringP.then( (res) => {
					let topicString = res.topicArr.map( (v) => {
						return v.name;
					}).toString();
					let questionInstance = Question.build({
						title: question.title,
						time: question.time,
						topics: topicString,
						follownum: res.followNum,
						summary: question.summary,
						questionid: question.questionid,
						answerid: question.answerid,
						authorname: question.authorname,
						authorhash: question.authorhash,
						avatar: question.avatar,
						vote: question.vote
					});
					questionInstance.save()
					.then( () => {
						res.topicArr.forEach( (topic, i) => {
							let topicInstance = Topic.findOrCreate({
								where: {id: topic.id},
								defaults: {name: topic.name}
							})
							.spread( (topicInstance, created) => {
								topicInstance.count++;
								topicInstance.save();
								questionInstance.setDataValue('topic'+i, topicInstance.id);
								questionInstance.save()
								.then( () => {
									console.log(question.questionid, " success");
								})
								.catch( () => {
									console.log(question.questionid, " db save topic error");
								})
							})
						})
					})
					.catch( (err) => {
						console.error(question.questionid, " db error for reason: ", err);
					})
				})
			}, config.zhihu_sleep + sleepOffset);
			sleepOffset += config.zhihu_sleep;
		})
	})
	.catch( (err) => {
		console.error(time, " API error");
	})
}


function start() {
	let startTime = new Date(config.start_year, config.start_month, config.start_day);
	let endTime = new Date().getTime();
	let sleepOffset = 0;
	while (startTime.getTime() < endTime) {
		let timeString = dateToString(startTime);
		setTimeout( () => {
			getQuestion(timeString);
		}, config.kanzhihu_sleep + sleepOffset);
		let nextDay = startTime.getTime() + config.kanzhihu_interval;
		startTime.setTime(nextDay);
		sleepOffset += config.kanzhihu_sleep;
	}
}

function dateToString(date) {
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}
	let day = date.getDate();
	if (day < 10) {
		day = '0' + day;
	}
	return '' + year + month + day;
}

start();