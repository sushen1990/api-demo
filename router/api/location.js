'use strict';
const express = require("express");
const router = express.Router();
const request = require('request');
const soap = require('soap');
const crypto = require('crypto');
const Helper = require('../../common/helper')
const config = require("../../config.js")
const moment = require('moment');

// 测试
router.get("/test", (req, res) => {
	res.json({
		msg: "hello location"
	})
});

// 新建用户和终端号码
router.post("/locationAdd", (req, res) => {
	let Scode = req.body.Scode;
	let userMobile = req.body.userMobile;
	let terminalMobile = req.body.terminalMobile;

	// 验证参数
	if (Helper.checkTel(userMobile)) {
		return res.status(400).json({
			msg: "no",
			data: "家长的手机号码需要为11位数字"
		})
	}
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};

	// 验证用户号码是否已存在
	let options = {
		method: 'POST',
		url: config.locationBaseUrl + 'user_info.php',
		form: {
			"key": config.locationKey,
			"number": userMobile
		}
	};
	request(options, (err, doc) => {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			})
		}
		doc = JSON.parse(doc.body)
		if (doc.msg == "用户不存在") {
			
			// 新建用户
			return res.json({
				msg: "no",
				data: doc
			});
		} else if (doc.msg == "操作成功") {

			// 用户已存在，查询终端号码
			options = {
				method: 'POST',
				url: config.locationBaseUrl + 'terminal_lists.php',
				form: {
					"key": config.locationKey,
					"unumber": userMobile,
					"number": terminalMobile
				}
			};
			request(options, (err1, doc1) => {

				if (err1) {
					return res.status(500).json({
						msg: "no",
						data: "服务器内部错误,请联系后台开发人员!!!" + err1
					})
				}
				doc1 = JSON.parse(doc1.body)

				if (doc1.msg != "操作成功") {
					return res.json({
						msg: "no",
						data: doc1
					});
				}
				
				//当前终端号码不存在于数据库
				if (doc1.result.length != 0) {
					return res.json({
						msg: "no",
						data: doc1
					});
				}
				
				//终端号码已在数据库，不允许新建
				return res.json({
					msg: "yes",
					data: doc1
				});
			})
		} else {
			res.json({
				msg: "no",
				data: doc
			});
		}
	})
});

// loaction 测试
router.post("/locationAddUser", (req, res) => {
	let Scode = req.body.Scode;
	let userMobile = req.body.userMobile;
	let terminalMobile = req.body.terminalMobile;

	// 验证参数
	if (Helper.checkTel(userMobile)) {
		return res.status(400).json({
			msg: "no",
			data: "家长的手机号码需要为11位数字"
		})
	}
	if (Helper.checkTel(terminalMobile)) {
		return res.status(400).json({
			msg: "no",
			data: "终端的手机号码需要为11位数字"
		})
	}
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};

	var options = {
		method: 'POST',
		url: config.locationBaseUrl + 'user_add.php',
		form: {
			"key": config.locationKey,
			"name": userMobile,
			"pwd": userMobile,
			"number": userMobile,
		}
	};
	request(options, function(err, result) {
		if (err) {
			return res.json({
				msg: "no",
				data: err
			});
		}
		res.json({
			msg: "yes",
			data: result
		});
	})

});



// 根据设备手机号获取设备定位信息
router.post("/getLocationByMobile", (req, res) => {
	let Scode = req.body.Scode;
	let mobile = req.body.mobile;
	let stime = req.body.stime;

	if (Helper.checkTel(mobile)) {
		return res.status(400).json({
			msg: "no",
			data: "手机号码需要为11位数字"
		})
	}
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};



	let url = config.locationBaseUrl + "locrecord_lists.php?";
	url = url + "key=" + config.locationKey;
	url = url + "&tnumber=" + mobile;

	let etime = null;

	if (!Helper.checkReal(stime)) { // 有日期参数
		etime = moment(stime).add(1, "day").format("YYYY-MM-DD");
	} else { // 没有日期参数		
		stime = moment().format("YYYY-MM-DD");
		etime = moment().add(1, "day").format("YYYY-MM-DD");
	}

	url = url + "&stime=" + stime;
	url = url + "&etime=" + etime;

	request.get(url, (err, doc) => {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			})
		}
		doc = JSON.parse(doc.body)
		if (doc.msg != "操作成功") {
			return res.json({
				msg: "no",
				data: doc.msg
			})
		}
		res.json({
			msg: "ok",
			data: doc.result
		});
	})

})

// 激活物联卡
router.post("/activeDevice", (req, res) => {

	let mobile = req.body.mobile;
	let Scode = req.body.Scode;

	// 参数验证

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
		client.SendSMS(args, function(err1, result) {
			if (err1) {
				return res.status(500).json({
					msg: "no",
					data: "祥东系统出错！" + err1
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
