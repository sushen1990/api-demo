var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//定义VerificationCode对象模型

var VerificationCodeSchema = new Schema({
	modelId: {
		type: String,
		default: null
	},
	//验证码
	code: {
		type: String,
		default: null
	},
	//时间
	time: {
		type: Number,
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

//新增
exports.add = function(code, mobile, modelId, callback) {
	VerificationCode.findOne({
		mobile: mobile,
		modelId: modelId
	}, function(err0, doc0) {
		if (err0) {
			return callback(err0);
		}
		if (doc0) {
			doc0.code = code;
			doc0.time = new Date().getTime() + 5 * 60 * 1000;
			doc0.save(function(err1) {
				if (err1) {
					return callback(err1);
				}
				callback(null, doc0);
			});
			return;
		}
		var newVerificationCode = new VerificationCode();
		newVerificationCode.modelId = modelId;
		newVerificationCode.code = code;
		newVerificationCode.mobile = mobile;
		newVerificationCode.time = new Date().getTime() + 5 * 60 * 1000;
		newVerificationCode.save(function(err) {
			if (err) {
				return callback(err);
			}
			callback(null, doc0);
		});
	});
}

var findCodeByMobile = exports.findCodeByMobile = function(mobile, modelId, callback) {
	VerificationCode.findOne({
		mobile: mobile,
		modelId: modelId
	}, function(err, doc) {
		if (err) {
			return callback(err, null);
		}
		callback(null, doc);
	});
}