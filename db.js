var Sequelize = require('sequelize');
var config = require('./config');

var sequelize = new Sequelize(config.dbname, config.dbuser, config.dbpassword, {
	host: config.dbserver,
	dialect: config.dbtype,
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	logging: false
});

module.exports = sequelize;