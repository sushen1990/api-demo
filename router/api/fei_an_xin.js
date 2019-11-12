'use strict';
const express = require("express");
const router = express.Router();
const moment = require('moment');
const FeiAnXinHelper = require('../../common/FeiAnXinHelper');
const Helper = require('../../common/helper');
const config = require("../../config");
const validator = require('../../validator/index');

// 测试接口是否连通 
router.get("/test", (req, res) => {

	res.json({
		msg: "hello fei_an_xin"
	})
});

router.post("/test", async (req, res) => {

	res.json({
		req: req.body,
	})
});

// 新增电子围栏列表
router.post("/fence_add", async (req, res) => {


	let now_time = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
	// 1. 验证参数
	let plan_param = {
		'Scode': true,
		'student_mobile': true,
		'latitude': true,
		'longitude': true,
		'rang': true,
		'name': true,
	};
	const {
		errors,
		isValid,
		true_list
	} = validator(plan_param, req.body);

	if (!isValid) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: errors,
			now_time
		})
	};
	// 1.1 验证range只能为100~2000的整数

	let rang = true_list.rang;
	let range_limit = rang >= 100 && rang <= 3000;

	if (!range_limit) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: {
				'err': 'range只能为100~3000'
			},
			now_time
		})
	};

	let student_mobile = true_list.student_mobile;
	let latitude = true_list.latitude;
	let longitude = true_list.longitude;
	let name = true_list.name;

	//  2. 获取定位时间段Id 
	let postData1 = {
		url: "locreport_lists.php",
		form: {
			"tnumber": student_mobile, //终端手机号
		}
	}

	//  3. 添加电子围栏
	let postData2 = {
		url: "fence_add.php",
		form: {
			"tnumber": student_mobile, //终端手机号
			"lrid": "", // 定位时段Id
			"latitude": latitude, //经度
			"longitude": longitude, //经度
			"type": "0", //类型 (0 出 1 入)
			"rang": rang, //范围 米
			"name": name
		}
	}

	let result_err = null
	try {
		//  2.1 获取定位时段Id
		let result1 = await FeiAnXinHelper.locationAPI(postData1);
		if (result1.msg === '终端不存在') {
			return res.json({
				msg: 'no',
				info: 'param_wrong',
				data: {
					'err': student_mobile + '终端不存在'
				},
				now_time
			})
		}
		let lrid = result1.result[0].id;

		//  3.1 使用定位时段Id，添加电子围栏
		postData2.form.lrid = lrid;
		let result2 = await FeiAnXinHelper.locationAPI(postData2);

		//  3.2 更改出入方向，再次添加电子围栏
		postData2.form.type = '1';
		let result3 = await FeiAnXinHelper.locationAPI(postData2);

		res.json({
			msg: "ok",
			info: 'recently_saved',
			data: result3,
			now_time
		})
	} catch (e) {
		res.status(500).json({
			msg: "no",
			result_err,
			data: "服务器内部错误,请联系后台开发人员!!!" + e,
			now_time
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
	let Id1 = req.body.Id1; // 电子围栏Id
	let Id2 = req.body.Id2; // 出入方向，两个id。要删除两次

	//  1. 参数验证
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		console.log(config.Scode)
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};

	if (Helper.checkReal(Id1) || Helper.checkReal(Id2)) {
		return res.status(400).json({
			msg: "no",
			data: "电子围栏Id错误"
		})
	};

	//  2. 向飞安信服务器请求数据，并根据情况返回
	let postData1 = {
		url: "fence_del.php",
		form: {
			"id": Id1, //电子围栏Id
		}
	};
	let postData2 = {
		url: "fence_del.php",
		form: {
			"id": Id2, //电子围栏Id
		}
	};

	try {
		// 2.1 第一次删除
		let result1 = await FeiAnXinHelper.locationAPI(postData1);
		// 2.2 第二次删除
		let result2 = await FeiAnXinHelper.locationAPI(postData2);

		res.json({
			msg: "ok",
			data: result2
		})
	} catch (e) {
		res.status(500).json({
			msg: "no",
			data: "服务器内部错误,请联系后台开发人员!!!" + e
		})
	};
});

module.exports = router;
