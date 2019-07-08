const path = require('path');
const Alipay = require('alipay-node-sdk');
let outTradeId = Date.now().toString();

const AppID = '2019062865738092';
const APP_PRIVATE_KEY_PATH = './static/app_private_key.pem';
const APP_PUBLIC_KEY_PATH = './static/app_public_key.pem';

var ali = new Alipay({
    appId: AppID,
    notifyUrl: 'http://www.xxx.com/callback/alipay',
    rsaPrivate: path.resolve(APP_PRIVATE_KEY_PATH),
    rsaPublic: path.resolve(APP_PUBLIC_KEY_PATH),
    sandbox: false,
    signType: 'RSA'
});

var params = ali.appPay({
    subject: '测试商品',
    body: '测试商品描述',
    outTradeId: outTradeId,
    timeout: '10m',
    amount: '10.00',
    goodsType: '0'
});
console.log(params);