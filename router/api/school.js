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

	if (!Scode || Scode != config.Scode) {
		console.log(config.Scode)
		return res.status(400).json({
			msg: "Scode错误",
			data: null
		})
	}
	if (!schoolName) {
		return res.status(400).json({
			msg: "缺少值schoolName",
			data: null
		})
	}
	// 去重查询
	schoolDB.findSchoolByName(schoolName, function(err, doc) {

		if (doc) {
			return res.status(403).json({
				msg: "当前学校名已经被注册",
				data: null
			})
		}

		if (err) {
			return res.status(500).json({
				msg: "服务器内部错误,请联系后台开发人员!!!",
				data: err
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
		console.log(postData)
		schoolDB.schoolSave(postData, function(err, result) {
			if (err) {
				return res.status(500).json({
					msg: "服务器内部错误,请联系后台开发人员!!!",
					data: err
				})
			}
			res.json({
				msg: "ok",
				resources: result
			})

		})
	})
})


// 获取学校列表
router.post("/schoolList", (req, res) => {
	let Scode = req.body.Scode;

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "Scode错误",
			data: null
		})
	}
	schoolDB.getSchoolList(function(err, doc){
		if (err) {
			return res.status(500).json({
				msg: "服务器内部错误,请联系后台开发人员!!!",
				data: err
			})
		}
		if (!doc) {
			return res.status(404).json({
				msg: "没有数据",
				data: err
			})
		}
		res.status(200).json({
			msg: "ok",
			resources: doc
		})
	})
})

// 删除学校
router.post("/schoolRemove", (req, res) => {
	let Scode = req.body.Scode;
	let schoolID = req.body.schoolID;

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "Scode错误",
			data: null
		})
	}
	if (Helper.checkReal(schoolID)) {
		return res.status(400).json({
			msg: "schoolID错误",
			data: null
		})
	}
	
	schoolDB.schoolRemove(schoolID, function(err, doc){
		if (err) {
			return res.status(500).json({
				msg: "服务器内部错误,请联系后台开发人员!!!",
				data: err
			})
		}
		if (!doc) {
			return res.status(404).json({
				msg: "没有数据",
				data: err
			})
		}
		res.json({
			msg: "ok",
			resources: doc
		})
	})
})
module.exports = router;
