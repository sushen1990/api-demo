const getuiSDK = require("gt-push-sdk")
const GeTui = require('../node_modules/gt-push-sdk/GT.push')
const Target = require('../node_modules/gt-push-sdk//getui/Target');
const TransmissionTemplate = require('../node_modules/gt-push-sdk//getui/template/TransmissionTemplate');
const SingleMessage = require('../node_modules/gt-push-sdk/getui/message/SingleMessage');


// 1. 定义参数
const APPID = '3N7QzgGj4E7iGK0JFSCs51';
const APPKEY = 'niKoSAxFyk8DzDxyvUhbP1';
const MASTERSECRET = 'a13RUA7I1490TjsgUyGIFA'
const HOST = 'http://sdk.open.api.igexin.com/apiex.htm';
var CID = '47ca94193c566a42e34c770827223419'
var transmissionContent = "您的学生离开了电子围栏【家】"

let gt = new GeTui(HOST, APPKEY, MASTERSECRET);

pushMessageToSingle()

exports.pushMsg = function(cid, content) {
	CID = cid
	transmissionContent = content
	pushMessageToSingle();
}

function pushMessageToSingle() {
	var template = TransmissionTemplateDemo();
	//    var template = LinkTemplateDemo();
	//    var template = NotificationTemplateDemo();
	//    var template = NotyPopLoadTemplateDemo();

	//个推信息体
	var message = new SingleMessage({
		isOffline: true, //是否离线
		offlineExpireTime: 3600 * 12 * 1000, //离线时间
		data: template //设置推送消息类型
	});

	//接收方
	var target = new Target({
		appId: APPID,
		clientId: CID
		//        alias:'_lalala_'
	});
	//target.setAppId(APPID).setClientId(CID);

	// try {
	// 	gt.pushMessageToSingle(message, target, function(err, res) {
	// 		console.log("demo print", res);
	// 	});
	// } catch (e) {
	// 	if (e instanceof RequestError) {
	// 		gt.pushMessageToSingle(message, target, e.requestId, function(err, res) {
	// 			console.log("demo print", res);
	// 		});
	// 	}
	// 	console.log(e)
	// }

	try {
		gt.pushMessageToSingle(message, target);
	} catch (e) {
		if (e instanceof RequestError) {
			gt.pushMessageToSingle(message, target, e.requestId);
		}
		console.log(e)
	}

}

function TransmissionTemplateDemo() {
	var template = new TransmissionTemplate({
		appId: APPID,
		appKey: APPKEY,
		transmissionType: 1,
		transmissionContent
	});
	//APN简单推送
	//var payload = new APNPayload();
	////var alertMsg = new SimpleAlertMsg();
	////alertMsg.alertMsg="";
	////payload.alertMsg = alertMsg;
	//payload.badge=5;
	//payload.contentAvailable =1;
	//payload.category="";
	//payload.sound="";
	////payload.customMsg.payload1="";
	//template.setApnInfo(payload);

	//APN高级推送
	//var payload = new APNPayload();
	//var alertMsg = new DictionaryAlertMsg();
	//alertMsg.body = "body";
	//alertMsg.actionLocKey = "actionLocKey";
	//alertMsg.locKey = "locKey";
	//alertMsg.locArgs = Array("locArgs");
	//alertMsg.launchImage = "launchImage";
	////ios8.2以上版本支持
	//alertMsg.title = "title";
	//alertMsg.titleLocKey = "titleLocKey";
	//alertMsg.titleLocArgs = Array("titleLocArgs");
	//
	//payload.alertMsg=alertMsg;
	//payload.badge=5;
	//    payload.contentAvailable =1;
	//    payload.category="";
	//    payload.sound="";
	//    payload.customMsg.payload1="payload";
	//    template.setApnInfo(payload);
	return template;
}
