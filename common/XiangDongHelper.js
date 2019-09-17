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


// 查询白名单列表
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

	// 返回Promise
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
			});
		});

	});
}

// 对白名单进行配置
exports.voice_config = function(postData) {

	// 1. 整理数据
	var url = 'http://211.142.198.14:8050/M2M/VoiceWhitelist/Service.asmx?wsdl';
	var timestamp = Math.round(new Date().getTime() / 1000).toString() // 时间戳
	var str = get_md5(timestamp)
	var args = {
		account,
		timestamp,
		sign: str,
		operType: postData.operType,
		msisdn: postData.msisdn,
		whiteNumber: postData.whiteNumber,
	};
	var err_data = {
		'err': 1,
		'data': {
			'msg': ''
		}
	}

	// 返回Promise
	return new Promise(function(resolve, reject) {
		soap.createClient(url, function(err, client) {
			client.Config(args, function(err1, result) {
				if (err || err1) {
					err_data.data.msg = '服务器未连接'
					reject(err_data);
				} else {
					resolve({
						'err': 0,
						'data': result,
						args
					});
				}
			});
		});

	});
}
