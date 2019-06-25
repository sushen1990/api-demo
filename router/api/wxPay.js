'use strict';
const express = require("express");
const router = express.Router();
const request = require('request');
const soap = require('soap');
const crypto = require('crypto');
const Helper = require('../../common/helper') 

 // 发起微信支付
router.post("/pay", (req,res)=>{
	let appid = 'wx70d38cc41cd6acbb' ;
	let mch_id = '1490235482' ;
	let nonce_str = Helper.str32();
	let notify_url = 'http://www.weixin.qq.com/wxpay/pay.php' ;
	let out_trade_no = '23333' ;
	let spbill_create_ip = '123.12.12.123' ;
	let total_fee = 22 ;
	let trade_type = 'JSAPI' ;
	
	var timeStamp = ((new Date().getTime() / 1000) | 0).toString();
	var wechatApiKey = '7sZT6fQbTXiz2Bk3DFkezpXx6FkM4AHa';
	var md5 = crypto.createHash('md5');
	var _package = "Sign=WXPay";
	var keyvaluestring = "appid=" + appid + "&noncestr=" + nonce_str + "&package=" + _package + "&partnerid=" + mch_id + "&prepayid=" + out_trade_no + "&timestamp=" + timeStamp;
	var stringTmp = keyvaluestring + "&key=" + wechatApiKey;
	var stringMd5 = md5.update(stringTmp).digest('hex').toUpperCase();
	
	var content = ['<xml>', '<appid>' + appid + '</appid>', //公众账号ID
		'<attach>' + attach + '</attach>', // 自定义参数 如深圳分店
		'<body><![CDATA[' + body + ']]></body>', 
		'<mch_id>' + mch_id + '</mch_id>', //商户号
		'<nonce_str>' + nonce_str + '</nonce_str>', // 32位随机字符串
		'<notify_url>' + notify_url + '</notify_url>', //异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
		 '<out_trade_no>' + out_trade_no + '</out_trade_no>', //商户订单号
		 '<spbill_create_ip>' + spbill_create_ip + '</spbill_create_ip>', //用户的客户端IP
		 '<total_fee>' + total_fee + '</total_fee>', //订单总金额，单位为分
		 '<trade_type>' + trade_type + '</trade_type>', //JSAPI
		 '<sign><![CDATA[' + stringMd5 + ']]></sign>', //签名
		 '</xml>'].join('');
	
	let url = 'https://api.mch.weixin.qq.com/pay/unifiedorder' ;
	request.post(url,(err,result,doc)=>{
		if(err){
			return res.status(500).json({ msg: "系统错误，代码！"+ err, data:err})
		}else{
			doc = JSON.parse(doc);
			if(doc.status == 0 && doc.msg == "操作成功" ){
				res.json({
					msg: "ok",
					data: doc.result
				});
			}else{
				res.status(500).json({ msg: "定位卡API系统错误，代码！"+ doc.msg, data:doc.result})
			}
		}
	})	
}