'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Helper = require('./helper')
const config = require('../config')
const moment = require('moment');

// 返回支付付款字符串，用来调用付款台
exports.getAlipayTradeString = function(out_trade_no, subject, total_amount) {

	// const AppID = '2019070565762733'; // 信天游的！
	const AppID = '2019082666450460'; // 冠美的
	const APP_PRIVATE_KEY_PATH = './static/app_private_key.pem'; // 商户秘钥路径
	const subject = subject; //付款标题

	// 1、业务参数
	let aliPaySignObj = {
		alipay_sdk: "alipay-sdk-php-20161101",
		app_id: AppID,
		method: 'alipay.trade.app.pay',
		charset: 'utf-8',
		sign_type: 'RSA2',
		timestamp: Helper.getDateStringWithMoment(),
		version: '1.0',
		notify_url: config.notifyUrl, // 异步回调通知地址
		biz_content: JSON.stringify({
			subject: subject,
			out_trade_no: out_trade_no,
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
	let signer = crypto.createSign('RSA-SHA256').update(signStr);
	let privateKey = fs.readFileSync(APP_PRIVATE_KEY_PATH).toString();
	let sign = signer.sign(privateKey, 'base64');
	const result = encodeStr + 'sign=' + encodeURIComponent(sign);

	return result;
}

// 生成唯一订单号
exports.getOrderByType = function(type) {
	let time = helper.getDateStringWithMoment();
	let int13 = helper.randomStr(13);
	let result = type + time + int13;
	return
}
