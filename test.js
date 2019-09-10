// const moment = require('moment')
const crypto = require('crypto');
const FeiAnXinHelper = require('./common/FeiAnXinHelper');

async function load() {
	try {

		let userMobile = 15617719879;
		let terminalMobile = 17299516908;

		// 1. 添加终端的定位时段
		let postData = {
			url: "locreport_add.php",
			form: {
				"tnumber": terminalMobile, //终端手机号
				"week": "1234567", //周几
				"stime": "06:00", //每天开始定位时间
				"etime": "22:00", //每天结束定位时间
				"itime": "3", //定位间隔
			}
		}
		// let result1 = await devicehelper.locationAPI(postData);
		// console.log(result1);

		// 2. 添加终端的的安全围栏
		let postData1 = {
			url: "locreport_lists.php",
			form: {
				"tnumber": terminalMobile, //终端手机号
			}
		}
		let result2 = await FeiAnXinHelper.locationAPI(postData1);
		console.log(result2.result[0].id);

	} catch (err) {
		console.log(err);
	}
}
load()
