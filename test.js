// const orderInfo = await model.order.findOne({
// 	'orderStatus.status': {
// 		$in: [1, 9]
// 	},
// 	orderCode: ctx.params.orderCode,
// 	createdBy: ctx.user.userid,
// 	isDelete: false
// }, {
// 	_id: 0,
// 	orderCode: 1,
// 	transCode: 1,
// 	orderProducts: 1,
// 	CNYCharge: 1
// })
// if (!orderInfo) {
// 	throw {
// 		status: 20001,
// 		message: 'paying orderInfo not exists'
// 	}
// 	return
// }
const Helper = require('./common/helper') 
const AppID = '2019062865738092';
const APP_PRIVATE_KEY_PATH = './static/app_private_key.pem';
const fs = require('fs');
const crypto = require('crypto');

let aliPaySignObj = {
	app_id: AppID,
	method: 'alipay.trade.app.pay',
	charset: 'utf-8',
	sign_type: 'RSA2',
	timestamp: Helper.getNowYtoS(),
	version: '1.0',
	notify_url: "https://www.sushen1990.cn:3000",
	biz_content: JSON.stringify({
		body: '冰糖葫芦',
		subject: '冰糖葫芦',
		out_trade_no: Date.now().toString(),
		timeout_express: '15m',
		total_amount: 0.01,
		product_code: 'QUICK_MSECURITY_PAY'
	})
};
let signStr = '',
	encodeStr = '';
for (let n of Object.keys(aliPaySignObj).sort()) {
	signStr += (n + '=' + aliPaySignObj[n] + '&');
	encodeStr += (n + '=' + encodeURIComponent(aliPaySignObj[n]) + '&');
}
signStr = signStr.substring(0, signStr.length - 1);
var signer = crypto.createSign('RSA-SHA1').update(signStr);
let privateKey = fs.readFileSync(APP_PRIVATE_KEY_PATH,"utf-8");
let sign = signer.sign(privateKey, 'base64')

console.log(sign)