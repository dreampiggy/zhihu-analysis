var Sequelize = require('sequelize');
var sequelize = require('./db');
var config = require('./config');

var Question = sequelize.define('question', {
	title: Sequelize.STRING,
	time: Sequelize.DATE,
	topics: Sequelize.STRING,
	topic0: Sequelize.UUID,
	topic1: Sequelize.UUID,
	topic2: Sequelize.UUID,
	topic3: Sequelize.UUID,
	topic4: Sequelize.UUID,
	follownum: Sequelize.INTEGER,
	summary: Sequelize.STRING,
	questionid: Sequelize.STRING,
	answerid: Sequelize.STRING,
	authorname: Sequelize.STRING,
	authorhash: Sequelize.STRING,
	avatar: Sequelize.STRING,
	vote: Sequelize.INTEGER
})

Question.sync({force: config.debug});

module.exports = Question;