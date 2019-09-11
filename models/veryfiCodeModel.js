const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Helper = require('../common/helper');
const config = require("../config");


//定义VerificationCode对象模型
const VerificationCodeSchema = new Schema({
	//验证码
	veryfiCode: {
		type: String,
		default: null
	},
	//时间
	time: {
		type: String,
		default: new Date().getTime()
	},
	//手机号
	mobile: {
		type: String,
		default: null
	}
});

//访问VerificationCode对象模型
mongoose.model('VerificationCode', VerificationCodeSchema);
var VerificationCode = mongoose.model('VerificationCode');

//或新建、更新数据库中的验证码
exports.add = function(veryfiCode, mobile, callback) {
	VerificationCode.findOne({
		mobile: mobile
	}, function(err0, doc0) {
		if (err0) {
			return callback(err0, null);
		}
		if (doc0) {
			doc0.veryfiCode = veryfiCode;
			doc0.time = new Date().getTime() + 5 * 60 * 1000; //设置5分钟以后失效
			doc0.save(function(err1) {
				if (err1) {
					return callback(err1, null);
				}
				callback(null, doc0);
			});
		} else {
			var newVerificationCode = new VerificationCode();
			newVerificationCode.veryfiCode = veryfiCode;
			newVerificationCode.mobile = mobile;
			newVerificationCode.time = new Date().getTime() + 5 * 60 * 1000;
			newVerificationCode.save(function(err) {
				if (err) {
					return callback(err);
				}
				callback(null, newVerificationCode);
			});
		}

	});
}


// 查询验证码
exports.findBywhereStr = function(whereStr, callback) {
	VerificationCode.findOne(whereStr, function(err, doc) {
		if (err) {
			return callback(err, null);
		}
		callback(null, doc);
	});
}

// 查询验证码
exports.checkVeryfiCodeByWhereStr = function(whereStr, code, callback) {
	VerificationCode.findOne(whereStr, function(err, doc) {
		if (err) {
			return callback(err, null);
		};

		let result = {
			"msg": "no",
			"info": "没有数据"
		};

		if (!doc) {
			result["msg"] = "no";
			result["info"] = "验证码不存在，请重新获取";
			return callback(null, result);
		};

		if (code != doc.veryfiCode) {
			result["msg"] = "no";
			result["info"] = "验证码错误，请核对修改后重新提交";
			return callback(null, result);
		};

		let nowTime = new Date().getTime();
		if (doc.veryfiCode == code && doc.time < nowTime) {
			result["msg"] = "no";
			result["info"] = "验证码已过期，请重新获取验证码";
			return callback(null, result);
		};

		result["msg"] = "yes";
		result["info"] = "验证码正确";
		return callback(null, result);
	});
};

// 查询验证码
exports.checkVeryfiCodeByWhereStr1 = function(whereStr, code) {

	return new Promise(function(resolve, reject) {
		VerificationCode.findOne(whereStr, function(err, doc) {
			let result = {
				"msg": "no",
				"info": "没有数据"
			};

			if (err) {
				result["info"] = "验证码不存在，请重新获取";
				reject(result);
				return;
			};


			if (!doc) {
				result["info"] = "验证码不存在，请重新获取";
				resolve(result);
				return;
			}

			if (code != doc.veryfiCode) {
				result["info"] = "验证码错误，请核对修改后重新提交";
				resolve(result);
				return;
			};

			let nowTime = new Date().getTime();
			if (doc.veryfiCode == code && doc.time < nowTime) {
				result["info"] = '验证码已过期，请重新获取验证码';
				resolve(result);
				return;

			};

			result["msg"] = 'yes';
			result["info"] = '验证码正确';
			resolve(result);
		});

	})

}
