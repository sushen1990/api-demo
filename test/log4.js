var log4js = require('log4js');
log4js.configure({
	appenders: {
		debug: {
			type: 'dateFile',
			filename: '../logs/debug/',
			pattern: 'yyyy-MM-dd.log',
			alwaysIncludePattern: true
		},

		info: {
			type: 'dateFile',
			filename: '../logs/info/',
			pattern: 'yyyy-MM-dd.log',
			alwaysIncludePattern: true
		},

		error: {
			type: 'dateFile',
			filename: '../logs/error/',
			pattern: 'yyyy-MM-dd.log',
			alwaysIncludePattern: true
		},
	},
	categories: {
		default: {
			appenders: ['debug'],
			level: 'debug'
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

var logger = log4js.getLogger('error');
var logger1 = log4js.getLogger('info');
let data = {
	obj: '添加失败',
	msg: '原因'
}

// logger.error(data);
logger1.info(data);
