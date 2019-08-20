const express = require("express")
const router = express.Router()
const UserModel = require("../../models/testUser")
const bcrypt = require("bcrypt")

const Helper = require('../../common/helper');
const config = require("../../config");
const userDB = require("../../models/userModel.js")
const studentDB = require("../../models/studentModel.js")
const classDB = require("../../models/classModel.js")
const schoolDB = require("../../models/schoolModel.js")

// $route Get api/users/test
// @desc 测试接口是否连通
// @access pulic
router.get("/test", (req, res) => {
	res.json({
		msg: "hello users"
	})
});

router.post("/findByMobile", (req, res) => {
	let Scode = req.body.Scode;
	let mobile = req.body.mobile;
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

	userDB.findUserByMobile(mobile, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			});
		};
		if (!result) {
			return res.status(500).json({
				msg: "no",
				data: "服务器端没有查询到数据！"
			});
		};
		res.json({
			msg: "ok",
			data: result
		})
	});
});

// $route Post api/users/regi
// @desc 注册
// @access pulic
router.post("/regi", (req, res) => {
	let Scode = req.body.Scode;
	let mobile = req.body.mobile;
	let truename = req.body.truename;
	// 参数验证 start ↓
	if (Helper.checkTel(mobile)) {
		return res.status(400).json({
			msg: "no",
			data: "手机号码需要为11位数字"
		})
	};
	if (Helper.checkReal(truename)) {
		return res.status(400).json({
			msg: "no",
			data: "姓名不能为空"
		})
	};
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	// 参数验证 end   ↑
	let postData = {
		mobile: mobile,
		truename: truename
	};
	// 检查手机号是否已注册 start ↓
	// 检查手机号是否已注册 end   ↑

	userDB.findUserByMobile(mobile, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			});
		};
		if (!result) {
			return res.status(500).json({
				msg: "no",
				data: "手机号已注册！"
			});
		};
		userDB.SaveNew(postData, function(err1, result1) {
			if (err1) {
				return res.status(500).json({
					msg: "no",
					data: "服务器内部错误,请联系后台开发人员!!!" + err1
				});
			};
			res.json({
				msg: "ok",
				data: result
			});
		});
	});















})

// $route Post api/users/telLogin
// @desc 家长用户通过手机验证码登录   mobile modelId verifyCode
// @access pulic
router.post("/LoginParent", (req, res) => {

	let mobile = req.body.mobile;
	let modelId = req.body.modelId;
	// let verifyCode = req.body.verifyCode;

	if (!mobile || mobile == "" || mobile == undefined) {
		return res.status(400).json({
			msg: "手机号码不能为空！",
			data: null
		})
	}
	if (!modelId || modelId == "" || modelId == undefined) {
		return res.status(400).json({
			msg: "关键值不能为空！",
			data: null
		})
	}
	// if (!verifyCode || verifyCode == "" || verifyCode == undefined) {
	//     return res.status(400).json({
	//         msg: "验证码不能为空！"
	//     })
	// }


	if (Helper.checkTel(mobile)) {
		return res.status(400).json({
			msg: "手机号码格式不正确！",
			data: null
		})
	};

	userDB.findUserByMobile(mobile, modelId, function(err0, doc0) {
		if (err0) {
			return res.status(404).json({
				msg: err0,
				data: null
			})
		}

		var newObj = {
			"_id": doc0._id,
			"truename": doc0.truename,
			"nickname": doc0.nickname,
			"mobile": doc0.mobile,
			"roleId": doc0.roleId,
			"roleName": doc0.roleName,
			"companyId": doc0.companyId,
			"companyName": doc0.companyName,
			"modelId": doc0.modelId,
			"lastLoginTime": doc0.lastLoginTime,
			"lastLoginWay": doc0.lastLoginWay,
			"cardID": doc0.cardID,
			"createDate": doc0.createDate,
			"openid": doc0.openid,
			"wechatSubscribeDate": doc0.wechatSubscribeDate,
			"wechatSubscribe": doc0.wechatSubscribe,
			"channelId": doc0.channelId,
			"channelName": doc0.channelName,
			"agentId": doc0.agentId,
			"agentTrueName": doc0.agentTrueName,
			"sex": doc0.sex,
			"city": doc0.city,
			"province": doc0.province,
			"country": doc0.country,
			"headimgurl": doc0.headimgurl,
			"note": doc0.note,
			studentInfo: {},
			classInfo: {},
			schoolInfo: {}
		}

		// 开始获取学生班级学校等信息
		studentDB.findStudentByParentUserId(doc0._id, modelId, function(err1, result) {

			if (err1) {
				return res.json({
					msg: "ok",
					data: newObj
				});
			}
			if (!result) {
				return res.json({
					msg: "ok",
					data: newObj
				});
			}
			newObj.studentInfo = result; //添加学生信息

			//查询班级信息
			classDB.findClassById(result.classId, function(err2, result2) {
				if (err2) {
					return res.json({
						msg: "ok",
						data: newObj
					});
				}
				if (!result2) {
					return res.json({
						msg: "ok",
						data: newObj
					});
				}
				newObj.classInfo = result2; //添加班级信息
				//查询学校信息
				schoolDB.findSchoolById(result2.schoolId, function(err3, result3) {
					if (err3) {
						return res.json({
							msg: "ok",
							data: newObj
						});
					}
					if (!result3) {
						return res.json({
							msg: "ok",
							data: newObj
						});
					}
					newObj.schoolInfo = result3; //添加学校信息
					res.json({
						msg: "ok",
						data: newObj
					});
				});
			});

		});
	})
})
module.exports = router;
