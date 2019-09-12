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

// 测试
router.get("/test", (req, res) => {
	res.json({
		msg: "hello VeryfiCode"
	})
});

//  预设家长手机号获取验证码
router.post("/sendVeryfiCodeInLogin", (req, res) => {

	let mobile = req.body.mobile;
	let Scode = req.body.Scode;

	// 1. 参数验证
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

	let whereStr = {
		isShow: true,
		preParentsPhones: mobile
	};

	// 2. 验证手机号是否为学生预设家长手机号
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
			// 3. 验证通过，创建验证码
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
				//  4. SendSms 发送短信的正确方式
				client.request('SendSms', params, requestOption).then((result) => {
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
	let cid = req.body.cid;

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
			data: "验证码需要为6位数字"
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
	veryfiCodeDB.checkVeryfiCodeByWhereStr(whereStr, veryfiCode, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "后端API错误" + err
			})
		};

		if (result.msg == "no") {

			// 验证码未通过，返回错误信息
			return res.status(403).json({
				msg: "no",
				data: result.info
			});

		} else if (result.msg == "yes") {

			// 验证码通过 继续
			let userPostData = {
				mobile,
				truename,
				cid
			};

			// 新建用户，返回用户信息。如果用户已存在，也返回用户信息。
			userDB.userLoginByCode(userPostData, function(err1, result1) {
				if (err1) {
					return res.status(500).json({
						msg: "no",
						data: "服务器内部错误,请联系后台开发人员!!!" + err1
					});
				};

				// 保存用户信息
				let userInfo = {
					_id: null,
					mobile: null,
					truename: null,
					studentsCount: 0,
					studentsInfo: []
				};
				userInfo._id = result1.data._id;
				userInfo.mobile = result1.data.mobile;
				userInfo.truename = result1.data.truename;


				let updatePostData = {
					_id: userInfo._id,
					mobile: userInfo.mobile
				};
				// 关联家长 
				studentDB.updateStudentParent(updatePostData, function(err2, result2) {
					if (err2) {
						return res.status(500).json({
							msg: "no",
							data: "服务器内部错误,请联系后台开发人员!!!" + err2
						});
					};

					//  获取学生信息
					studentDB.findStudentsByParentUserId(userInfo._id, function(err3, result3) {
						if (err3) {
							return res.status(500).json({
								msg: "no",
								data: "服务器内部错误,请联系后台开发人员!!!" + err3
							});

						};
						userInfo.studentsCount = result3.total;
						userInfo.studentsInfo = result3.data;
						res.json({
							msg: "ok",
							parent: userInfo,
							student: result3.data[0]
						})
					})

				});
				// 更新student的普通家长信息 end   ↑
			});
		};

	});
});


// 登录的时候验证验证码
// router.post("/checkVeryfiCode1", (req, res) => {
// 	let mobile = req.body.mobile;
// 	let truename = req.body.truename;
// 	let veryfiCode = req.body.veryfiCode;
// 	let Scode = req.body.Scode;
// 	let cid = req.body.cid;
// 
// 	// 1. 检查参数
// 	if (Helper.checkReal(Scode) || Scode != config.Scode) {
// 		return res.status(400).json({
// 			msg: "no",
// 			data: "Scode错误"
// 		})
// 	};
// 	if (Helper.checkTel(mobile)) {
// 		return res.status(400).json({
// 			msg: "no",
// 			data: "手机号码需要为11位数字"
// 		})
// 	};
// 	if (Helper.checkVeryfiCode(veryfiCode)) {
// 		return res.status(400).json({
// 			msg: "no",
// 			data: "验证码需要为6位数字"
// 		})
// 	};
// 	if (Helper.checkReal(truename)) {
// 		truename = "家长";
// 	};
// 
// 
// 
// 	// 2. 检查验证码
// 	let whereStr = {
// 		mobile: mobile
// 	};
// 	veryfiCodeDB.checkVeryfiCodeByWhereStr1(whereStr, veryfiCode).then((get_veryfiCode) => {
// 		// 2.1 验证码不合法
// 		if (get_veryfiCode.msg === 'no') {
// 			return res.json({
// 				msg: "ok",
// 				data: get_veryfiCode
// 			})
// 		}
// 		// 2.2 验证码通过继续。新建并返回用户信息。如果用户已存在，直接返回用户信息
// 		
// 		
// 		res.json({
// 			msg: "ok",
// 			data: get_veryfiCode
// 		})
// 
// 
// 	}).catch((err) => {
// 		res.status(500).json({
// 			msg: 'no',
// 			data: '服务器内部错误,请联系后台开发人员!!!' + err.data
// 		})
// 	})
// })


module.exports = router;
