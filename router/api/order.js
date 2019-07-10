"use strict";
const express = require("express");
const router = express.Router();
const Helper = require("../../common/helper");
const OrderModel = require("../../models/orderModel")

// 订单相关

// 获取尚未支付订单信息
router.get("/getOrderToPay", (req,res)=>{
	OrderModel.findOrderToPay(function(err,result){
		if (err) {
			return res.status(401).json({msg: "no", data:err})			
		}else if (result){
			res.json({msg: "ok", data:result})
		}
	})

})

// 创建订单
router.post("/addOrder", (req,res)=>{
	OrderModel.findByID(function(err,result){
		if (err) {
			return res.status(401).json({msg: "no", data:err})			
		}else if (result){
			res.json({msg: "ok", data:result})
		}
	})

})

module.exports = router;