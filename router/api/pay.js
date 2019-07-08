"use strict";
const express = require("express");
const router = express.Router();
const path = require('path');
const Alipay = require('alipay-node-sdk');

router.get("/test",(req,res) =>{ 
    res.json({msg:"hello q"})
})

router.get("/getOrderInfo", (req,res)=>{
	
	var outTradeId = Date.now().toString();
	const AppID = '2019062865738092';
	const APP_PRIVATE_KEY_PATH = './static/app_private_key.pem';
	const APP_PUBLIC_KEY_PATH = './static/app_public_key.pem';

	var ali = new Alipay({
		appId: AppID,
		notifyUrl: 'https://www.sushen1990.cn:3000/api/pay/test',
		rsaPrivate: path.resolve(APP_PRIVATE_KEY_PATH),
		rsaPublic: path.resolve(APP_PUBLIC_KEY_PATH),
		sandbox: true,
		signType: 'RSA'
	});

	var params = ali.appPay({
		subject: '校安通服务',
		body: '测试商品描述',
		outTradeId: outTradeId,
		timeout: '10m',
		amount: '0.01',
		goodsType: '0'
	});
	// console.log(params);	
		
	
	if(!params){
		return res.status(401).json({msg: "no", data:err})			
	}else if (params){
		res.json({msg: "ok", data:params})

	}
})
module.exports = router;