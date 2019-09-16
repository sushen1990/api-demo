const soap = require('soap');
const crypto = require('crypto');

// 0. 手机号
let msisdn = '17299516908';
// 1. url 地址
var url = 'http://211.142.198.14:8050/M2M/VoiceWhitelist/Service.asmx?wsdl';
// var url = 'http://211.142.198.14:8050/M2M/VoiceWhitelist/Service.asmx';
// 2. 时间戳
var timestamp = Math.round(new Date().getTime() / 1000).toString()
// 3. 账号
var account = 'A10937';
// 4. 签名秘钥
var sign = 'O3QZgKaskM6wZAKKsd2utO2WET4';
// 4.1 加密签名
var md5 = crypto.createHash("md5");
md5.update(sign + timestamp + account);
var str = md5.digest('hex');
sign = str.toUpperCase();

var args = {
	account,
	timestamp,
	sign,
	msisdn,
};

// soap.createClient(url, function(err, client) {
// 	client.Query(args, function(err1, result) {
// 		if (err1) {
// 			console.log('服务器未连接')
// 			return
// 		}
// 		result = JSON.stringify(result)
// 		result = JSON.parse(result)
// 		let info = result.QueryResult.ErrorInfo;
// 		let err_code = result.QueryResult.ErrorCode;
// 
// 		if (err_code != 0) {
// 			console.log('错误。' + err_code)
// 			return
// 		}
// 		let data = result.QueryResult.Data;
// 		console.log(data)
// 	});
// });

soap.createClient(url, function(err, client) {
	client.Query(args, function(err1, result) {
		if (err1) {
			console.log('服务器未连接')
			return
		}
		result = JSON.stringify(result)
		result = JSON.parse(result)
		let info = result.QueryResult.ErrorInfo;
		let err_code = result.QueryResult.ErrorCode;

		if (err_code != 0) {
			console.log('错误。' + err_code)
			return
		}

		let data = result.QueryResult.Data.string;
		console.log(data)

	});
});
