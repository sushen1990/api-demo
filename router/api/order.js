"use strict";
const express = require("express");
const router = express.Router();
const Helper = require("../../common/helper");
const OrderDB = require("../../models/orderModel")

// 测试接口是否连通 start ↓
router.get("/test", (req, res) => {
	res.json({
		msg: "hello order"
	})
});

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

// 更新订单信息

module.exports = router;
