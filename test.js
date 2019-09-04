const devicehelper = require('./common/deviceHelper');

async function load() {
	try {
		// 1. 第一次执行
		let postData = {
			url: "user_info.php",
			form: {
				"number": 15617719878
			}
		}
		let result1 = await devicehelper.locationAPI(postData)
		console.log(result1.msg)
		console.log(result1)

		// 2. 第二次执行
		postData = {
			url: "user_info.php",
			form: {
				"number": 15617719877
			}
		}
		let result2 = await devicehelper.locationAPI(postData)
		console.log(result2.msg)


	} catch (err) {
		console.log(err);
	}
}
load()
