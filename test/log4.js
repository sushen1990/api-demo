var log4js = require('log4js');
log4js.configure({
	appenders: {
		info: {
			type: 'dateFile',
			filename: './logs/info/',
			pattern: 'yyyy-MM-dd.log',
			alwaysIncludePattern: true
		},

		error: {
			type: 'dateFile',
			filename: './logs/error/',
			pattern: 'yyyy-MM-dd.log',
			alwaysIncludePattern: true
		},
	},
	categories: {
		default: {
			appenders: ['error'],
			level: 'error'
		},
		info: {
			appenders: ['info'],
			level: 'info'
		},
		error: {
			appenders: ['error'],
			level: 'error'
		},

	}
});

exports.getLogger = function(name) { //name取categories项
	return log4js.getLogger(name || 'info')
}
