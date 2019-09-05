const moment = require('moment')
const crypto = require('crypto');
const devicehelper = require('./common/deviceHelper');

async function load() {
	try {
		console.log(moment().format('hh:mm:ss:SS') + '--开始执行') // 开始执行

		let userMobile = 15617719879;
		let terminalMobile = 15038124527;

		// 1. 查看终端的定位时段
		let postData = {
			url: "locreport_lists.php",
			form: {
				"tnumber": terminalMobile, //终端手机号
			}
		};
		let result1 = await devicehelper.locationAPI(postData);
		console.log(result1)

		// 2. 添加终端的定位时段
		postData = {
			url: "locreport_add.php",
			form: {
				"tnumber": terminalMobile, //终端手机号
				"week": "1234567", //周几
				"stime": "06:00", //每天开始定位时间
				"etime": "22:00", //每天结束定位时间
				"itime": "20", //定位间隔
			}
		}
		// let result2 = await devicehelper.locationAPI(postData);
		// console.log(result2)

		console.log(moment().format('hh:mm:ss:SS') + '--执行结束') // 执行结束
	} catch (err) {
		console.log(err);
	}
}
load()
