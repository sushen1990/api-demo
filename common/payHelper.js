'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Helper = require('./helper')

exports.getAlipayOrderInfo = function(out_trade_no, body, total_amount){
	
	let SIGN = "";
	const AppID = '2019070565762733';
	const APP_PRIVATE_KEY_PATH = './static/app_private_key.pem';	
	const subject = "校安通服务"; //付款标题

	// 1、业务参数
	let aliPaySignObj = {
		alipay_sdk: "alipay-sdk-php-20161101" ,
		app_id: AppID,
		method: 'alipay.trade.app.pay',
		charset: 'utf-8',
		sign_type: 'RSA2',
		timestamp: Helper.getNowYtoS(),
		version: '1.0',
		biz_content: JSON.stringify({
			body: body,
			subject: subject,
			out_trade_no: out_trade_no,
			timeout_express: '15m',
			total_amount: total_amount,
			product_code: 'QUICK_MSECURITY_PAY'
		})
	};
	
	let signStr = '',
		encodeStr = '';
	// 2、 排序并且拼接业务参数
	for (let n of Object.keys(aliPaySignObj).sort()) {
		signStr += (n + '=' + aliPaySignObj[n] + '&');
		encodeStr += (n + '=' + encodeURIComponent(aliPaySignObj[n]) + '&');
	}
	signStr = signStr.substring(0, signStr.length - 1);
	
	// 3、结尾加上sign
	var signer = crypto.createSign('RSA-SHA256').update(signStr);
	let privateKey = fs.readFileSync(APP_PRIVATE_KEY_PATH).toString();
	let sign = signer.sign(privateKey, 'base64');	
	const result = encodeStr + 'sign=' + encodeURIComponent(sign);
	
	return result;
	
}