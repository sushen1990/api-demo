const AlipaySdk = require('alipay-sdk').default;
const Helper = require('./common/helper');
const fs = require('fs');

const alipaySdk = new AlipaySdk({
	appId: '2019070565762733',
	privateKey: fs.readFileSync('./static/app_private_key.pem', 'ascii'),
});


// const result = await alipaySdk.exec('alipay.system.oauth.token', {
// 	charset: 'utf-8',
// 	sign_type: 'RSA2',
// 	timestamp: Helper.getNowYtoS(),
// 	version: '1.0',
// 	biz_content: JSON.stringify({
// 		body: "校安通服务费1年",
// 		subject: "测试",
// 		out_trade_no: "123456789",
// 		timeout_express: '15m',
// 		total_amount: 2.2,
// 		product_code: 'QUICK_MSECURITY_PAY'
// 	}),
// });
// 
alipaySdk.exec('alipay.trade.app.pay', {
		charset: 'utf-8',
		sign_type: 'RSA2',
		timestamp: Helper.getNowYtoS(),
		version: '1.0',
		biz_content: JSON.stringify({
			body: "校安通服务费1年",
			subject: "测试",
			out_trade_no: "123456789",
			timeout_express: '15m',
			total_amount: 2.2,
			product_code: 'QUICK_MSECURITY_PAY'
		})
	}).then(result => {
		console.log(result);
	})
	.catch(err => {
		console.log(err);
	})
