const AlipaySdk = require('alipay-sdk').default;
const fs = require("fs") //文件

var APP_PRIVATE_KEY_PATH = './static/app_private_key.pem';

const alipaySdk = new AlipaySdk({
    appId: '2019062865738092',
    privateKey: fs.readFileSync(APP_PRIVATE_KEY_PATH, 'ascii'),
});


// 业务参数
function _buildBizContent(subject, outTradeNo, totalAmount) {
    let bizContent = {
        subject: subject,
        out_trade_no: outTradeNo,
        total_amount: totalAmount,
        product_code: 'QUICK_MSECURITY_PAY',
    };
 
    return JSON.stringify(bizContent);

}

// 生成签名

function _buildSign(paramsMap) {
	console.log(paramsMap)
    //1.获取所有请求参数，不包括字节类型参数，如文件、字节流，剔除sign字段，剔除值为空的参数
    let paramsList = [...paramsMap].filter(([k1, v1]) => k1 !== 'sign' && v1);
    //2.按照字符的键值ASCII码递增排序
    paramsList.sort();
    //3.组合成“参数=参数值”的格式，并且把这些参数用&字符连接起来
    let paramsString = paramsList.map(([k, v]) => `${k}=${v}`).join('&');
 
    let privateKey = fs.readFileSync(APP_PRIVATE_KEY_PATH, 'utf8');
    let signType = 'RSA';
    return _signWithPrivateKey(signType, paramsString, privateKey);
}

function _signWithPrivateKey(signType, content, privateKey) {
    let sign;
    if (signType.toUpperCase() === 'RSA2') {
        sign = crypto.createSign("RSA-SHA256");
    } else if (signType.toUpperCase() === 'RSA') {
        sign = crypto.createSign("RSA-SHA1");
    } else {
        throw new Error('请传入正确的签名方式，signType：' + signType);
    }
    sign.update(content);
    return sign.sign(privateKey, 'base64');
}




var BizContent = _buildBizContent("汇款", "23333", 19.9)
var Sing = _buildSign(BizContent)
// alipaySdk.exec('alipay.trade.pay', {
//   grantType: 'authorization_code',
//   code: 'code',
//   biz_content: 'token'
// })
//   .then(result => {
//     console.log(result);
//   })
//   .catch(err => {
// 	console.log(err);
//   }) 

console.log(Sing)