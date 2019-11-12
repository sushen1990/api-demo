'use strict';
const express = require("express");
const router = express.Router();
const request = require('request');
const soap = require('soap');
const crypto = require('crypto');
const moment = require('moment');
const Core = require('@alicloud/pop-core'); // 阿里短信sdk


const Helper = require('../../common/helper');
const config = require("../../config");
const config2 = require('../../config/keys');
const validator = require('../../validator/index');
const veryfiCodeDB = require("../../models/veryfiCodeModel");
const studentDB = require("../../models/studentModel");
const userDB = require("../../models/userModel");
const adminDB = require("../../models/adminModel");

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
		return res.json({
			msg: 'no',
			info: 'param_wrong ',
			data: {
				'err_msg': '手机号码需要为11位数字'
			},
			now_time: Helper.NowTime()
		})
	};
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.json({
			msg: 'no',
			info: 'param_wrong ',
			data: {
				'err_msg': '手机号码需要为Scode错误位数字'
			},
			now_time: Helper.NowTime()
		})
	};

	// 2. 验证手机号是否为学生预设家长手机号
	let query = {
		isShow: true,
		preParentsPhones: mobile
	};
	let veryfiCode = Helper.int6();
	let err_info = '';
	let err_msg = ''; // 错误的信息，方便客户端弹窗用
	studentDB.find(query).then((result_student) => {

		if (result_student.length === 0) { // 2.1 手机号不在预设家长手机号内，
			err_info = 'not_extsis';
			err_msg = '您的手机号尚未获取邀请。\n 请联系您的业务员或管理员家长！。';
			throw new Error('not_extsis')
		};

		// 3. 更新验证码，如果数据库中未创建数据，创建新数据
		query = {
			mobile
		};
		let return_new = {
			'new': true
		};
		let condition = {
			'veryfiCode': veryfiCode,
			'mobile': mobile,
			'time': new Date().getTime() + 15 * 60 * 1000,
		}
		return veryfiCodeDB.findOneAndUpdate(query, condition, return_new);

	}).then((result_update) => {

		if (result_update === null) { // 3.1 数据库没有数据，需要新建
			let newData = new veryfiCodeDB();
			newData.veryfiCode = veryfiCode;
			newData.mobile = mobile;
			newData.time = new Date().getTime() + 15 * 60 * 1000;
			return newData.save()
		} else { // 3.2 数据库存在数据
			return result_update;
		}
	}).then((result) => {
		// 4. 发送短信
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
		client.request('SendSms', params, requestOption).then((result_sms) => {
			res.json({
				msg: 'ok',
				info: 'got_it',
				data: result,
				now_time: Helper.NowTime()
			});
		}, (ex) => {
			err_info = 'err';
			err_msg = ex;
			throw new Error('err')
		});


		// res.json({
		// 	msg: 'ok',
		// 	info: 'got_it',
		// 	data: result,
		// 	now_time: Helper.NowTime()
		// });



	}).catch((Error) => {

		return res.json({
			msg: 'no',
			info: err_info === '' ? Error : err_info,
			data: err_info === '' ? Error : err_msg,
			now_time: Helper.NowTime()
		});
	})


})




// @route  POST api/veryfiCode/parent_login
// @desc   家长登录
// @access public

router.post('/parent_login', (req, res) => {
	let now_time = Helper.NowTime();
	// 0. 参数验证
	let plan_list = { // 计划要验证的参数和是否必须
		'Scode': true,
		'admin_name': true,
		'veryfi_code': true,
		'mobile': true,
	};
	const {
		errors,
		isValid,
		true_list
	} = validator(plan_list, req.body)
	if (!isValid) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: errors,
			now_time
		})
	}

	let admin_name = true_list.admin_name;
	let veryfi_code = true_list.veryfi_code;
	let mobile = true_list.mobile;
	let err_info = '';
	adminDB.findOne({
			'name': admin_name
		})
		.then(admin => {
			if (!admin) {
				err_info = 'not_extsis'
				throw new Error('not_extsis');
			}
			var newVeryfiCode = new veryfiCodeDB();

			newVeryfiCode.veryfiCode = veryfi_code;
			newVeryfiCode.mobile = mobile;
			newVeryfiCode.time = new Date().getTime() + 5 * 60 * 1000;


			return newVeryfiCode.save();
		})
		.then(result => {
			// let result = result;


			// return adminDB.findOne({
			// 	admin_name
			// });


			res.json({ // 4. 正常返回数据
				msg: 'ok',
				info: 'recently_saved',
				data: result,
				now_time,
			})
		})
		.catch(err => {
			// console.log(typeof(err));

			console.log(err.toString())
			console.log(err)

			return res.json({
				msg: 'no',
				info: err_info === '' ? 'err' : err_info,
				data: err.toString(),
				now_time,
			});

			return res.json({
				err: str1.ReferenceError
			})
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






module.exports = router;
