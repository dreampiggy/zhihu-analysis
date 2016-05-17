var Sequelize = require('sequelize');
var sequelize = require('./db');

var Question = sequelize.define('question', {
	title: Sequelize.STRING,
	time: Sequelize.DATE,
	topic: Sequelize.STRING,
	follownum: Sequelize.INTEGER,
	summary: Sequelize.STRING,
	questionid: Sequelize.STRING,
	answerid: Sequelize.STRING,
	authorname: Sequelize.STRING,
	authorhash: Sequelize.STRING,
	avatar: Sequelize.STRING,
	vote: Sequelize.INTEGER
})
Question.sync({force: true});

module.exports = Question;