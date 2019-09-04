const request = require('request');
// const moment = require('moment');
const config = require('../config')

exports.locationAPI = function(postData) {

	// 补充request的必要参数
	postData.form["key"] = config.locationKey;
	let options = {
		method: 'POST',
		url: config.locationBaseUrl + postData.url,
		form: postData.form
	};

	// 返回Promise的对象
	return new Promise(function(resolve, reject) {
		request(options, function(err, doc) {
			if (err) {
				reject(error);
			} else {
				resolve(JSON.parse(doc.body));
			}
		});
	});
}
