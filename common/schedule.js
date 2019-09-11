const schedule = require('node-schedule');
const FeiAnXinHelper = require('./common/FeiAnXinHelper');

exports.scheduleCronstyle = function() {
	//每分钟的第30秒定时执行一次:
	schedule.scheduleJob('30 * * * * *', () => {
		console.log('scheduleCronstyle:' + new Date());
	});
}

// 定时获取安全围栏出入记录，push到对应的app用户
exports.scheduleFenceNotify = async function() {

	try {
		schedule.scheduleJob('30 * * * * *', () => {

			// 1. 查询安全围栏的出入记录
			let terminalMobile = 17299516908;
			let postData = {
				url: "fencerecord_lists.php",
				form: {
					"tnumber": terminalMobile, //终端手机号
				}
			}
			let result = await devicehelper.locationAPI(postData);
			let info = result.result[0];



		});

	} catch (e) {
		//TODO handle the exception
	}

}
