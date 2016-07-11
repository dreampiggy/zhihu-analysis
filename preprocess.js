'use strict';
var Sequelize = require('sequelize');
var sequelize = require('./db');

var Week = sequelize.define('week', {
	time: Sequelize.DATE,
	topic0: Sequelize.INTEGER,
	topic1: Sequelize.INTEGER,
	topic2: Sequelize.INTEGER,
	times0: Sequelize.INTEGER,
	times1: Sequelize.INTEGER,
	times2: Sequelize.INTEGER,
	name0: Sequelize.STRING,
	name1: Sequelize.STRING,
	name2: Sequelize.STRING
},{
    timestamps: false
});

Week.sync({force: false});

let startTime = new Date(2014, 8, 14);

Week.findAll()
.then( (posts) => {
	Promise.all(posts.map( (v) => {
		let week = v.id - 1;
		v.time = new Date(startTime.getTime() + week * 7 * 24 * 60 * 60 * 1000);
		v.save()
		.catch( (err) => {
			console.error(err);
		})
	}))
	.then( () => {
		console.log('All ok');
	})
	.catch( (err) => {
		console.log(err);
	})
})