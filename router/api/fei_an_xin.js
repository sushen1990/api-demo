'use strict';
const express = require("express");
const router = express.Router();
const deviceHelper = require('../../common/deviceHelper');

// 测试接口是否连通 
router.get("/test", (req, res) => {

	res.json({
		msg: "hello fei_an_xin"
	})
});


// 获取定位时间段、以及电子围栏列表
router.post("/loc_fence_list", async (req, res) => {

	let Scode = req.body.Scode;
	let userMobile = req.body.userMobile;
	let terminalMobile = req.body.terminalMobile;


	let result = null;
	let postData = {
		url: "fence_lists.php",
		form: {
			"tnumber": terminalMobile, //终端手机号
		}
	}

	try {
		result = await deviceHelper.locationAPI(postData);
		res.json({
			msg: "ok",
			data: result
		})
	} catch (e) {
		//TODO handle the exception
		result = null
		res.status(500).json({
			msg: "no",
			data: "服务器内部错误,请联系后台开发人员!!!" + e
		})
	}


});

module.exports = router;
