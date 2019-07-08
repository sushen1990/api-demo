"use strict";
const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Helper = require('../../common/helper') 

router.get("/test",(req,res) =>{ 
    res.json({msg:"hello q"})
})

router.get("/getOrderInfo", (req,res)=>{
	const AppID = '2019070565762733';
	const APP_PRIVATE_KEY_PATH = './static/app_private_key.pem';
	const APP_PUBLIC_KEY_PATH = './static/app_public_key.pem';
	let SIGN = "";
		
// 1、基础参数
	let params = new Map();
	params.set('app_id', AppID);
	params.set('method', 'alipay.trade.app.pay');
	params.set('charset', 'utf-8');
	params.set('sign_type', 'RSA2');
	params.set('timestamp', Helper.getNowYtoS());
	params.set('version', '1.0');
	params.set('notify_url', "https://www.sushen1990.cn:3000");
	params.set('biz_content', _buildBizContent('校安通服务', Date.now().toString(), '0.01'));

// 2、生成content

	function _buildBizContent(subject, outTradeNo, totalAmount) {
		let bizContent = {
			subject: subject,
			out_trade_no: outTradeNo,
			total_amount: totalAmount,
			product_code: 'QUICK_MSECURITY_PAY',
		};
	 
		return JSON.stringify(bizContent);
	}
	
// 3、生成签名
	function _buildSign(paramsMap) {
		//1.获取所有请求参数，不包括字节类型参数，如文件、字节流，剔除sign字段，剔除值为空的参数
		let paramsList = [...paramsMap].filter(([k1, v1]) => k1 !== 'sign' && v1);
		//2.按照字符的键值ASCII码递增排序
		paramsList.sort();
		//3.组合成“参数=参数值”的格式，并且把这些参数用&字符连接起来
		let paramsString = paramsList.map(([k, v]) => `${k}=${v}`).join('&');
	 
		let privateKey = fs.readFileSync(APP_PRIVATE_KEY_PATH, 'utf8');
		let signType = paramsMap.get('sign_type');
		
		SIGN = _signWithPrivateKey(signType, paramsString, privateKey);
	}
	 
	function _signWithPrivateKey(signType, content, privateKey) {
		let sign;
		if (signType.toUpperCase() === 'RSA2') {
			sign = crypto.createSign("RSA-SHA256");
		} else if (signType.toUpperCase() === 'RSA') {
			sign = crypto.createSign("RSA-SHA1");
		} else {
			return res.status(401).json({msg: "no", data:'请传入正确的签名方式，signType：' + signType})

		}
		sign.update(content);
		return sign.sign(privateKey, 'base64');
	}
	
	_buildSign(params)
	console.log(params)
	if(SIGN == ""){
		return res.status(401).json({msg: "no", data:null})
	}else {
		res.json({msg: "ok", data:SIGN})
	}
	// SIGN

})
module.exports = router;