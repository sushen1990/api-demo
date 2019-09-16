const soap = require('soap');
const crypto = require('crypto');
const account = 'A10937'; // 账号
const sign = 'O3QZgKaskM6wZAKKsd2utO2WET4'; // 秘钥

//  整理签名
function get_md5(timestamp) {
	var md5 = crypto.createHash("md5");
	md5.update(sign + timestamp + account);
	var str = md5.digest('hex').toUpperCase();
	return str
}



exports.voice_list = function(mobile) {

	// 1. 整理数据
	var url = 'http://211.142.198.14:8050/M2M/VoiceWhitelist/Service.asmx?wsdl';
	var timestamp = Math.round(new Date().getTime() / 1000).toString() // 时间戳
	var str = get_md5(timestamp)
	var args = {
		account,
		timestamp,
		sign: str,
		msisdn: mobile
	};
	var err_data = {
		'err': 1,
		'data': {
			'msg': ''
		}
	}

	// 返回Promise的对象 封装好的API
	return new Promise(function(resolve, reject) {

		soap.createClient(url, function(err, client) {
			client.Query(args, function(err1, result) {
				if (err || err1) {
					err_data.data.msg = '服务器未连接'
					reject(err_data);
				} else {
					resolve({
						'err': 0,
						'data': result
					});
				}
				// 				if (err1) {
				// 					err_data.data.msg = '服务器未连接'
				// 					reject(err_data);
				// 				}
				// 				result = JSON.stringify(result)
				// 				result = JSON.parse(result)
				// 				let info = result.QueryResult.ErrorInfo;
				// 				let err_code = result.QueryResult.ErrorCode;
				// 				console.log(err_code)
				// 				if (err_code.toString() != '0') {
				// 					err_data.data.msg = '参数错误。' + err_code
				// 					reject(err_data);
				// 				} else {
				// 					resolve({
				// 						'err': 0,
				// 						'data': result.QueryResult
				// 					});
				// 				}
				//

			});
		});

	});
}
