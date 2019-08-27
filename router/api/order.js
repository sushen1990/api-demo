"use strict";
const express = require("express");
const router = express.Router();
const Helper = require("../../common/helper");
const OrderDB = require("../../models/orderModel")

// 订单相关

// 获取尚未支付订单信息
router.post("/getOrderToPay", (req, res) => {

	let Scode = req.body.Scode;
	let studentId = req.body.studentId;
	let status = req.body.status;
	
	
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		console.log(config.Scode)
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	if (Helper.checkReal(studentId)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少参数studentId"
		})
	};
	if (Helper.checkReal(status)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少参数status"
		})
	};

	let postData = {
		studentId: req.body.studentId
	}
	OrderDB.findBywhereStr(postData, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			})
		}

		res.json(result)
	})

})

// 创建订单
router.post("/addOrder", (req, res) => {
	OrderModel.findByID(function(err, result) {
		if (err) {
			return res.status(401).json({
				msg: "no",
				data: err
			})
		} else if (result) {
			res.json({
				msg: "ok",
				data: result
			})
		}
	})

})

module.exports = router;
