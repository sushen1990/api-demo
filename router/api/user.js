const express = require("express")
const router = express.Router()
// const UserModel = require("../../models/testUser")
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

// 根据家长手机号查询
router.post("/findByMobile", (req, res) => {
	let Scode = req.body.Scode;
	let mobile = req.body.mobile;

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

	userDB.findBywhereStr({
		mobile: mobile,
		isShow: true
	}, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			});
		};
		if (!result) {
			return res.status(404).json({
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

// 根据whereStr号查询
// mobile 、 _id 、truename
router.post("/findByWhereStr", (req, res) => {
	let Scode = req.body.Scode;
	let mobile = req.body.mobile;
	let _id = req.body._id;
	let truename = req.body.truename;

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};

	let condition = {};

	if (mobile) {
		if (Helper.checkTel(mobile)) {
			return res.status(400).json({
				msg: "no",
				data: "手机号码需要为11位数字"
			})
		};
		condition.mobile = mobile;
	};
	if (_id) {
		if (Helper.checkReal(_id)) {
			return res.status(400).json({
				msg: "no",
				data: "_id错误"
			})
		};
		condition._id = _id;
	};
	if (truename) {
		if (Helper.checkReal(truename)) {
			return res.status(400).json({
				msg: "no",
				data: "姓名错误"
			})
		};
		condition.truename = truename;
	};

	if (Object.keys(condition).length == 0) {
		return res.status(400).json({
			msg: "no",
			data: "至少提供一个参数"
		})
	}

	userDB.findBywhereStr(condition, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			});
		};
		if (!result) {
			return res.status(404).json({
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


router.post("/findStudentsByParentId", (req, res) => {
	let Scode = req.body.Scode;
	let _id = req.body._id;

	studentDB.findStudentsByParentUserId(_id, function(err, doc) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			});
		};
		res.json({
			data: doc
		})
	})

});


module.exports = router;
