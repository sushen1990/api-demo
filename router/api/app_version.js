'use strict';
const express = require("express");
const router = express.Router();
const moment = require('moment');
const Helper = require('../../common/helper');
const config = require("../../config")

// 测试接口是否连通
router.get("/test", (req, res) => {
	res.json({
		msg: "hello app_version"
	})
});


// 测试检查是否需要更新
router.post("/update", (req, res) => {
	let now_time = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

	// 1. 检查参数
	let Scode = req.body.Scode;
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: 'no',
			info: 'param_wrong',
			data: {
				'err_data': Scode
			},
			now_time
		})
	};
	let appid = req.body.appid === undefined ? '' : req.body.appid.toString().trim();
	let version = req.body.version === undefined ? '' : req.body.version.toString().trim();
	if (appid === '' || version === '') {
		return res.status(400).json({
			msg: 'no',
			info: 'param_wrong',
			data: {
				appid,
				version
			},
			now_time
		})
	};

	// 2. 判断是否需要更新
	if (appid === '__UNI__E995574' && version != '1.0.1') {
		return res.json({
			"status": 1, //升级标志，1：需要升级；0：无需升级  
			"note": "修复bug1；\n修复bug2;", //release notes  
			"url": "http://i3.res.meizu.com/resources/appStore/browser/views/browser-detail.html?packageName=com.ss.android.ugc.aweme&app_id=3130698&business=1" //更新包下载地址  
		})
	} else {
		return res.json({
			"status": 0, //升级标志，1：需要升级；0：无需升级 
		})
	}

});




module.exports = router;
