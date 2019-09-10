'use strict';
const express = require("express");
const router = express.Router();
const FeiAnXinHelper = require('../../common/FeiAnXinHelper');
const Helper = require('../../common/helper');
const config = require("../../config.js");

// 测试接口是否连通 
router.get("/test", (req, res) => {

	res.json({
		msg: "hello fei_an_xin"
	})
});

// 新增电子围栏列表
router.post("/fence_add", async (req, res) => {

	let Scode = req.body.Scode;
	let terminalMobile = req.body.terminalMobile;
	let latitude = req.body.latitude;
	let longitude = req.body.longitude;
	let rang = req.body.rang;
	let name = req.body.name;

	//  1. 参数验证
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		console.log(config.Scode)
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};

	if (Helper.checkTel(terminalMobile)) {
		return res.status(400).json({
			msg: "no",
			data: "terminalMobile手机号码需要为11位数字"
		})
	};

	if (Helper.checkReal(latitude) || Helper.checkReal(longitude)) {
		return res.status(400).json({
			msg: "no",
			data: "经纬度错误"
		})
	};

	if (Helper.checkReal(rang) || Helper.checkReal(name)) {
		return res.status(400).json({
			msg: "no",
			data: "范围或名字错误"
		})
	};


	//  2. 获取定位时间段Id 
	let postData1 = {
		url: "locreport_lists.php",
		form: {
			"tnumber": terminalMobile, //终端手机号
		}
	}

	//  3. 添加电子围栏
	let postData2 = {
		url: "fence_add.php",
		form: {
			"tnumber": terminalMobile, //终端手机号
			"lrid": "", // 定位时段Id
			"latitude": latitude, //经度
			"longitude": longitude, //经度
			"type": "0", //类型 (0 出 1 入)
			"rang": rang, //范围 米
			"name": name
		}
	}


	try {
		//  2.1 获取定位时段Id
		let result1 = await FeiAnXinHelper.locationAPI(postData1);
		let lrid = result1.result[0].id;

		//  3.1 使用定位时段Id，添加电子围栏
		postData2.form.lrid = lrid;
		let result2 = await FeiAnXinHelper.locationAPI(postData2);

		//  3.2 更改出入方向，再次添加电子围栏
		postData2.form.type = '1';
		let result3 = await FeiAnXinHelper.locationAPI(postData2);


		res.json({
			msg: "ok",
			data: result3
		})
	} catch (e) {
		res.status(500).json({
			msg: "no",
			data: "服务器内部错误,请联系后台开发人员!!!" + e
		})
	};
});


// 获取电子围栏列表
router.post("/fence_list", async (req, res) => {

	let Scode = req.body.Scode;
	let terminalMobile = req.body.terminalMobile;

	//  1. 参数验证
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		console.log(config.Scode)
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};

	if (Helper.checkTel(terminalMobile)) {
		return res.status(400).json({
			msg: "no",
			data: "terminalMobile手机号码需要为11位数字"
		})
	};


	//  2. 向飞安信服务器请求数据，并根据情况返回
	let postData = {
		url: "fence_lists.php",
		form: {
			"tnumber": terminalMobile, //终端手机号
		}
	};

	try {
		let result = await FeiAnXinHelper.locationAPI(postData);
		res.json({
			msg: "ok",
			data: result
		})
	} catch (e) {
		res.status(500).json({
			msg: "no",
			data: "服务器内部错误,请联系后台开发人员!!!" + e
		})
	};
});

// 删除电子围栏列表
router.post("/fence_delete", async (req, res) => {

	let Scode = req.body.Scode;
	let fid = req.body.id; // 电子围栏Id

	//  1. 参数验证
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		console.log(config.Scode)
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};

	if (Helper.checkReal(fid)) {
		return res.status(400).json({
			msg: "no",
			data: "电子围栏fid错误"
		})
	};

	//  2. 向飞安信服务器请求数据，并根据情况返回
	let postData = {
		url: "fence_del.php",
		form: {
			"id": fid, //终端手机号
		}
	};

	try {
		let result = await FeiAnXinHelper.locationAPI(postData);
		res.json({
			msg: "ok",
			data: result
		})
	} catch (e) {
		res.status(500).json({
			msg: "no",
			data: "服务器内部错误,请联系后台开发人员!!!" + e
		})
	};
});

module.exports = router;
