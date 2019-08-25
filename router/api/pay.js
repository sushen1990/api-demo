"use strict";
const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Helper = require('../../common/helper');
const payHelper = require('../../common/payHelper');


router.get("/test", (req, res) => {
	res.json({
		msg: "hello q"
	})
})

router.get("/getOrderInfo", (req, res) => {

	const out_trade_no = Helper.getPayOrderNo("AL");
	const body = "校安通服务费1年";
	const total_amount = 0.02;
	var orderInfo = "";
	orderInfo = payHelper.getAlipayOrderInfo(out_trade_no, body, total_amount)

	if (orderInfo == "") {
		return res.status(401).json({
			msg: "no",
			data: null
		})
	} else {
		res.json({
			msg: "ok",
			data: orderInfo
		})
	}

})
module.exports = router;
