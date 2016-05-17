'use strict';
var request = require('superagent');
var cheerio = require('cheerio');
var config = require('./config');
var Question = require('./question');

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
			let topicArr = $(topicTag).text().split('\n').filter( (v) => {
				if (v.length == 0) {
					return false;
				}
				return true;
			});
			let followNum = $(followTag).text().match(/\d/g);
			if (followNum == null) {
				followNum = 0;
			} else {
				followNum = parseInt(followNum.join(''));
			}
			let topicString = topicArr.toString();
			resolve({
				topic: topicString,
				follownum: followNum
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
					Question.build({
						title: question.title,
						time: question.time,
						topic: res.topic,
						follownum: res.follownum,
						summary: question.summary,
						questionid: question.questionid,
						answerid: question.answerid,
						authorname: question.authorname,
						authorhash: question.authorhash,
						avatar: question.avatar,
						vote: question.vote
					})
					.save()
					.then( (res) => {
						console.log(question.questionid, " success");
					})
					.catch( (err) => {
						console.error(question.questionid, " db error for reason: ", err);
					})
				})
			}, 10000 + sleepOffset);
			sleepOffset += 10000;
		})
	})
	.catch( (err) => {
		console.error(time, " API error");
	})
}


function start() {
	let startTime = new Date(config.begin_time);
	let endTime = new Date().getTime();
	let sleepOffset = 0;
	while (startTime.getTime() < endTime) {
		let timeString = dateToString(startTime);
		setTimeout( () => {
			getQuestion(timeString);
		}, 1000 + sleepOffset);
		let nextDay = startTime.getTime() + config.interval_days * 24 * 60 * 60 * 1000;
		startTime.setTime(nextDay);
		sleepOffset += 1000;
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