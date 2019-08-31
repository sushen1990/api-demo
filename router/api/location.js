'use strict';
const express = require("express");
const router = express.Router();
const request = require('request');
const soap = require('soap');
const crypto = require('crypto');
const Helper = require('../../common/helper')
const config = require("../../config.js")



// 添加定位设备用户和终端 新加


// 根据设备手机号获取设备定位信息
router.post("/getLocationByMobile", (req, res) => {
	let Scode = req.body.Scode;
	let mobile = req.body.mobile;
	let stime = req.body.stime;
	let etime = req.body.etime;

	if (Helper.checkTel(mobile)) {
		console.log(mobile);
		return res.status(400).json({
			msg: "定位卡终端手机号码不能为空！",
			data: null
		})
	}
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	
	
	
	let url = "http://www.ts10000.net/intf/open/locrecord_lists.php?";
	let key = "78a83e3be0e2be4cb1695167749f2b3a";
	url = url + "key=" + key;
	url = url + "&tnumber=" + mobile;

	if (stime && stime != "" || stime != undefined) {
		url = url + "&stime=" + stime;
	}
	if (etime && etime != "" || etime != undefined) {
		url = url + "&etime=" + etime;
	}

	request.get(url, (err, result, doc) => {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			})
		} else {
			doc = JSON.parse(doc);
			if (doc.status == 0 && doc.msg == "操作成功") {
				res.json({
					msg: "ok",
					data: doc.result
				});
			} else {
				res.status(500).json({
					msg:"no",
					data: "定位卡API系统错误，代码！" + doc.msg
				})
			}
		}
	})

})


// 激活物联卡
router.post("/activeDevice", (req, res) => {
	let mobile = req.body.mobile;
	if (Helper.checkTel(mobile)) {
		return res.status(400).json({
			msg: "手机号码需要为11位数字！",
			data: mobile
		})
	}

	var url = 'http://211.142.198.14:8050/M2M/API/Message.asmx?wsdl';
	var t = Math.round(new Date().getTime() / 1000).toString()
	var account1 = 'A10937';
	var sign = 'O3QZgKaskM6wZAKKsd2utO2WET4';
	var tel = mobile;
	var content = '#TB' + mobile + 'FFFFF013183.62.138.158:8083';

	var aaa = sign + t + account1;
	var md5 = crypto.createHash("md5");
	md5.update(aaa);
	var str = md5.digest('hex');
	var code1 = str.toUpperCase();
	var args = {
		account: account1,
		timestamp: t,
		sign: code1,
		msisdn: tel,
		content: content
	};

	soap.createClient(url, function(err, client) {
		client.SendSMS(args, function(err, result) {
			if (err) {
				return res.status(500).json({
					msg: "祥东系统出错！",
					data: err
				})
			}
			let info = '';
			info = result.SendSMSResult.Result[0]['Msg'];
			if (info == '短信已提交！') {
				res.json({
					msg: "ok",
					data: info
				})
			} else if (info == 'MSISDN 号不是所查询的集团下的用户！') {
				return res.status(404).json({
					msg: "no",
					data: '当前手机号不是所查询的集团下的用户！'
				})
			}
		});
	});
})
module.exports = router;
