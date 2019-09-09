// const moment = require('moment')
const crypto = require('crypto');
const devicehelper = require('./common/deviceHelper');

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
		postData = {
			url: "fence_add.php",
			form: {
				"tnumber": terminalMobile, //终端手机号
				"lrid": "237049", // 定位时段Id
				"latitude": "34.747066", //经度
				"longitude": "113.699915", //经度
				"type": "0", //类型 (0 出 1 入)
				"rang": "300", //范围 米
				"name": "围栏"
			}
		}
		let result2 = await devicehelper.locationAPI(postData);
		console.log(result2);

	} catch (err) {
		console.log(err);
	}
}
load()
