'use strict';
const express = require("express");
const router = express.Router();
const request = require('request');
const soap = require('soap');
const crypto = require('crypto');
const Core = require('@alicloud/pop-core'); // 阿里短信sdk
const moment = require('moment');
const Helper = require('../../common/helper');
const config = require("../../config");

const veryfiCodeDB = require("../../models/veryfiCodeModel.js");
const studentDB = require("../../models/studentModel.js")


router.get("/test", (req, res) => {
	res.json({
		msg: "hello VeryfiCode"
	})
});
//  预设家长手机号获取验证码
router.post("/sendVeryfiCodeInLogin", (req, res) => {

	let mobile = req.body.mobile;
	let Scode = req.body.Scode;

	// 参数验证 start ↓
	if (Helper.checkTel(mobile)) {
		return res.status(400).json({
			msg: "no",
			data: "手机号码需要为11位数字"
		})
	};
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	// 参数验证 end   ↑
	let whereStr = {
		isShow: true,
		preParentsPhones: mobile
	};
	studentDB.findStudentByWhereStr(whereStr, function(err0, result0) {
		if (err0) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			});
		};
		if (!result0) {
			return res.status(404).json({
				msg: "no",
				data: "没有数据"
			});
		} else {
			let veryfiCode = '';
			veryfiCode = Helper.int6();

			veryfiCodeDB.add(veryfiCode, mobile, function(err, result) {
				if (err) {
					return res.status(500).json({
						msg: "后端API错误！",
						data: err
					})
				};
				var client = new Core({
					accessKeyId: config.accessKeyId,
					accessKeySecret: config.accessKeySecret,
					endpoint: 'https://dysmsapi.aliyuncs.com',
					apiVersion: '2017-05-25'
				});
				var params = {
					"RegionId": "default",
					"PhoneNumbers": mobile,
					"SignName": "信天游",
					"TemplateCode": "SMS_163480790",
					"TemplateParam": JSON.stringify({
						"code": veryfiCode
					})
				}

				var requestOption = {
					method: 'POST'
				};

				// client.request('SendSms', params, requestOption).then((result) => {
				// 	res.json({
				// 		msg: "ok",
				// 		data: result
				// 	})
				// }, (ex) => {
				// 	return res.status(500).json({
				// 		msg: "后端API错误！",
				// 		data: ex
				// 	})
				// });
				res.json({
					msg: "ok",
					data: veryfiCode
				})
			});
		}
	})


})

//  用户获取验证码
router.post("/sendVeryfiCode", (req, res) => {

	let mobile = req.body.mobile;
	let Scode = req.body.Scode;

	// 参数验证 start ↓
	if (Helper.checkTel(mobile)) {
		return res.status(400).json({
			msg: "no",
			data: "手机号码需要为11位数字"
		})
	};
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	// 参数验证 end   ↑
	let veryfiCode = '';
	veryfiCode = Helper.int6();

	veryfiCodeDB.add(veryfiCode, mobile, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "后端API错误！",
				data: err
			})
		};
		var client = new Core({
			accessKeyId: config.accessKeyId,
			accessKeySecret: config.accessKeySecret,
			endpoint: 'https://dysmsapi.aliyuncs.com',
			apiVersion: '2017-05-25'
		});
		var params = {
			"RegionId": "default",
			"PhoneNumbers": mobile,
			"SignName": "信天游",
			"TemplateCode": "SMS_163480790",
			"TemplateParam": JSON.stringify({
				"code": veryfiCode
			})
		}

		var requestOption = {
			method: 'POST'
		};

		client.request('SendSms1', params, requestOption).then((result) => {
			res.json({
				msg: "ok",
				data: result
			})
		}, (ex) => {
			return res.status(500).json({
				msg: "后端API错误！",
				data: ex
			})
		});
	});
})


// 登录的时候验证验证码
router.post("/checkVeryfiCode", (req, res) => {
	let mobile = req.body.mobile;
	let veryfiCode = req.body.veryfiCode;
	let Scode = req.body.Scode;

	// 参数验证 start ↓
	if (Helper.checkTel(mobile)) {
		return res.status(400).json({
			msg: "手机号码只能为11位数字！",
			data: null
		})
	};
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	if (Helper.checkReal(veryfiCode)) {
		return res.status(400).json({
			msg: "验证码不能为空！",
			data: null
		})
	};
	// 参数验证 end   ↑
	let whereStr = {
		mobile: mobile
	};
	veryfiCodeDB.findBywhereStr(whereStr, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务端API错误,请联系开发人员"
			});
		};
		if (!result) {
			return res.status(404).json({
				msg: "no",
				data: "服务端未查询到数据！"
			});
		};

		let time1 = parseInt(result.time);
		let diffTime = moment(Date.now()).diff(moment(time1), "seconds");

		if (diffTime > 600) {
			return res.status(403).json({
				msg: "no",
				data: "当前数据已失效！"
			});
		} else {
			
			if(veryfiCode!=result.veryfiCode){
				
			}

			res.json({
				msg: "ok",
				data: result
			})
		}

	})


})

module.exports = router;
