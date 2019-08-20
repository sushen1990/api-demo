'use strict';
const express = require("express");
const router = express.Router();
const request = require('request');
const soap = require('soap');
const crypto = require('crypto');
const Helper = require('../../common/helper');
const config = require("../../config");
const veryfiCodeDB = require("../../models/veryfiCodeModel.js");
const studentDB = require("../../models/studentModel.js")
const userDB = require("../../models/userModel.js")
const Core = require('@alicloud/pop-core'); // 阿里短信sdk

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

	// 验证手机号是否为学生预设家长手机号
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
						msg: "no",
						data: "服务端发生错误" + err
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
						msg: "no",
						data: "后端API错误！" + ex
					})
				});
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
	let truename = req.body.truename;
	let veryfiCode = req.body.veryfiCode;
	let Scode = req.body.Scode;

	// 参数验证 start ↓
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	if (Helper.checkTel(mobile)) {
		return res.status(400).json({
			msg: "no",
			data: "手机号码需要为11位数字"
		})
	};
	if (Helper.checkVeryfiCode(veryfiCode)) {
		return res.status(400).json({
			msg: "no",
			data: veryfiCode
		})
	};
	if (Helper.checkReal(truename)) {
		truename = "家长";
	};
	// 参数验证 end   ↑

	let whereStr = {
		mobile: mobile
	};

	// 检查验证码 start ↓
	veryfiCodeDB.findBywhereStr(whereStr, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "后端API错误" + err
			})
		};
		if (!result) {
			return res.status(404).json({
				msg: "no",
				data: "验证码不存在，请重新获取"
			})
		};
		if (result.veryfiCode != veryfiCode) {
			return res.status(403).json({
				msg: "no",
				data: "验证码错误，请核对修改后重新提交!"
			})
		};
		var nowTime = new Date().getTime();
		if (result.veryfiCode == veryfiCode && result.time < nowTime) {
			return res.status(403).json({
				msg: "no",
				data: "验证码已过期，请重新获取验证码！"
			})
		};
		// 检查验证码 end   ↑

		let postData = {
			mobile: mobile,
			truename: truename
		};

		// 检查手机号是否已注册

		userDB.findUserByMobile(mobile, function(err1, result1) {
			if (err1) {
				return res.status(500).json({
					msg: "no",
					data: "服务器内部错误,请联系后台开发人员!!!" + err1
				});
			};

			// 家长预备返回信息
			let userInfo = {
				_id: null,
				mobile: null,
				truename: null,
				studentsCount: 0,
				studentsId: []
			};

			if (result1) {

				// 手机号已注册  start ↓
				userInfo._id = result1._id;
				userInfo.mobile = result1.mobile;
				userInfo.truename = result1.truename;
				// 手机号已注册  end   ↑

			} else {

				// 手机号没有注册，保存新用户的数据 start ↓
				userDB.SaveNew(postData, function(err2, result2) {
					if (err2) {
						return res.status(500).json({
							msg: "no",
							data: "服务器内部错误,请联系后台开发人员!!!" + err2
						});
					};

					userInfo._id = result2._id;
					userInfo.mobile = result2.mobile;
					userInfo.truename = result2.truename;

				});
				// 手机号没有注册，保存新用户的数据  end   ↑

			};
			// 更新student的普通家长信息 start ↓
			let condition = {
				"$and": [{
						"preParentsPhones": userInfo.mobile
					},
					{
						"parents": {
							"$ne": userInfo._id
						}
					}
				]
			};
			// condition = JSON.stringify(condition);
			let doc = {
				parents: userInfo._id
			}
			studentDB.updateStudentParent(condition, doc, function(err3, result3) {
				if (err3) {
					return res.status(500).json({
						msg: "no",
						data: "服务器内部错误,请联系后台开发人员!!!" + err3
					});
				};
				res.json({
					msg: "ok",
					data: {
						studentInfo: result3,
						userInfo: userInfo
					}
				})
			});
		});
	});
});

module.exports = router;
