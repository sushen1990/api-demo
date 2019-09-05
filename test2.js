const moment = require('moment')
const crypto = require('crypto');
const devicehelper = require('./common/deviceHelper');

async function bindDevice() {
	try {
		console.log(moment().format('hh:mm:ss:SS') + '--开始执行') // 开始执行

		let userMobile = 15617719879;
		let terminalMobile = 17652156524;

		let addNewUser = false; // 是否成功注册新用户
		let addNewTerminal = false; // 是否成功注册新终端

		// 1. 尝试开户。 必须添加一个终端信息
		var md5 = crypto.createHash('md5');
		var stringMd5 = md5.update("123456").digest('hex').toUpperCase();
		let postData = {
			url: "user_add.php",
			form: {
				"pwd": stringMd5, // 用户密码
				"number": userMobile, // 用户手机号
				"name": userMobile + '家长', // 用户名
				"tnumber": terminalMobile, //终端手机号
				"tname": terminalMobile + '终端', // 终端名
			}
		};
		let result1 = await devicehelper.locationAPI(postData);
		addNewUser = result1.status == 0 ? true : false; // status: 0 开户成功 7 用户手机号已注册

		// 2. 如果开户失败，并且status为7,表示用户已注册。直接添加终端
		if (!addNewUser && result1.status == 7) {


			let keynumList = '13271562261'; //  整理亲情号
			postData = {
				url: "terminal_add.php",
				form: {
					"name": terminalMobile + '终端', // 终端名
					"unumber": userMobile, // 用户手机号
					"number": terminalMobile, //终端手机号
					"keynum": keynumList //亲情号
				}
			};
			let result2 = await devicehelper.locationAPI(postData);
			console.log(result2)
			addNewTerminal = result2.status == 0 ? true : false; // status: 0 添加成功 7 手机号已注册
		}
		
		// 3. 添加回传数据时间间隔
		
		
		console.log({
			addNewUser,
			addNewTerminal
		})
		console.log(moment().format('hh:mm:ss:SS') + '--执行结束') // 执行结束
	} catch (err) {
		console.log(err);
	}
}

async function check() {
	try {
		console.log(moment().format('hh:mm:ss:SS') + '--开始执行') // 开始执行

		let userMobile = 15617719879;
		let terminalMobile = 15038124527;

		// 查看终端信息
		let postData = {
			url: "terminal_info.php",
			form: {
				"number": terminalMobile, //终端手机号
			}
		};
		let result1 = await devicehelper.locationAPI(postData);
		console.log(result1)


		console.log(moment().format('hh:mm:ss:SS') + '--执行结束') // 执行结束
	} catch (e) {
		//TODO handle the exception
	}
}
// bindDevice()
// check();
