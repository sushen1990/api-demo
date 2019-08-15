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
			doc0.time = new Date().getTime() + 5 * 60 * 1000;
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
