'use strict';
const express = require("express");
const router = express.Router();
const schoolDB = require("../../models/schoolModel.js")
const config = require("../../config.js")
const Helper = require('../../common/helper');

// 测试接口是否连通
router.get("/test", (req, res) => {
	res.json({
		msg: "hello school"
	})
})


// 新增学校
router.post("/schoolAdd", (req, res) => {
	let Scode = req.body.Scode;
	let schoolName = req.body.schoolName;
	let proviceFirstStageName = req.body.proviceFirstStageName;
	let addressCitySecondStageName = req.body.addressCitySecondStageName;
	let addressCountiesThirdStageName = req.body.addressCountiesThirdStageName;
	let address = req.body.address;
	let contacts = req.body.contacts;
	let contactsPhone = req.body.contactsPhone;
	let schoolType = req.body.schoolType;
	let position = req.body.position;
	let info = req.body.info;
	let imageUrl = req.body.imageUrl;

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		console.log(config.Scode)
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	}
	if (Helper.checkReal(schoolName)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少值schoolName"
		})
	}
	if (Helper.checkTel(contactsPhone)) {
		return res.status(400).json({
			msg: "no",
			data: "手机号码格式不正确!"
		})
	};
	// 去重查询
	schoolDB.findSchoolByName(schoolName, function(err, doc) {

		if (doc) {
			return res.status(403).json({
				msg: "no",
				data: "当前学校名已经被注册"
			})
		}

		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!"
			})
		}
		const postData = {
			schoolName: schoolName,
			proviceFirstStageName: proviceFirstStageName,
			addressCitySecondStageName: addressCitySecondStageName,
			addressCountiesThirdStageName: addressCountiesThirdStageName,
			address: address,
			contacts: contacts,
			contactsPhone: contactsPhone,
			schoolType: schoolType,
			position: position,
			info: info,
			imageUrl: imageUrl
		}

		schoolDB.schoolSave(postData, function(err, result) {
			if (err) {
				return res.status(500).json({
					msg: "no",
					data: "服务器内部错误,请联系后台开发人员!!!"
				})
			}
			let data = result;
			res.json({
				msg: "ok",
				resources: data
			})

		})
	})
})


// 获取学校列表
router.post("/schoolList", (req, res) => {
	let Scode = req.body.Scode;

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	}
	schoolDB.getSchoolList(function(err, doc) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!"
			})
		}
		if (!doc) {
			return res.status(404).json({
				msg: "no",
				data: "没有数据！"
			})
		}
		let data = doc;
		res.status(200).json({
			msg: "ok",
			data: data
		})
	})
})

// 分页获取学校
router.post("/schoolListPage", (req, res) => {
	let Scode = req.body.Scode;
	let page = req.body.page;
	let size = req.body.size;

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	}
	if (Helper.checkReal(page)) {
		return res.status(400).json({
			msg: "no",
			data: "page错误"
		})
	}
	if (Helper.checkReal(size)) {
		return res.status(400).json({
			msg: "no",
			data: "size错误"
		})
	}
	schoolDB.getSchoolListPaginate(page, size, function(err, doc) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			})
		}
		if (!doc) {
			return res.status(404).json({
				msg: "no",
				data: "没有数据！"
			})
		}
		let data = doc;
		res.status(200).json({
			msg: "ok",
			data: data
		})
	})
})


// 删除学校
router.post("/schoolRemove", (req, res) => {
	let Scode = req.body.Scode;
	let schoolID = req.body.schoolID;

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	}
	if (Helper.checkReal(schoolID)) {
		return res.status(400).json({
			msg: "no",
			data: "schoolID错误"			
		})
	}

	schoolDB.schoolRemove(schoolID, function(err, doc) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!"
			})
		}
		if (!doc) {
			return res.status(404).json({
				msg: "no",
				data: "没有数据！"
			})
		}
		let data = doc;
		res.status(200).json({
			msg: "ok",
			data: data
		})
	})
})
module.exports = router;
