// const XiangDongHelper = require('../../common/XiangDongHelper')
const XiangDongHelper = require('../common/XiangDongHelper')
const moment = require('moment');
// let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS')

function nowTime() {
	return moment().format('YYYY-MM-DD HH:mm:ss.SSS')
}


// 获取白名单
async function voice_list(mobile) {
	console.log(nowTime());
	let result = await XiangDongHelper.voice_list(mobile);
	result = JSON.stringify(result);
	result = JSON.parse(result);
	console.log(result)
	if (result.err === '0') {
		console.log('失败');
		return
	}
	if (result.data.QueryResult.ErrorCode != '0') {
		console.log('参数错误');
		return
	}

	let data = result.data.QueryResult.Data;
	console.log(data);
	console.log(nowTime());
	console.log('------完成-------');
}

// 添加白名单
async function voice_add(postData) {
	console.log(nowTime());
	let result = await XiangDongHelper.voice_config(postData);
	result = JSON.stringify(result);
	result = JSON.parse(result);
	console.log(result)
	// 	if (result.err === '0') {
	// 		console.log('失败');
	// 		return
	// 	}
	// 	if (result.data.QueryResult.ErrorCode != '0') {
	// 		console.log('参数错误');
	// 		return
	// 	}
	// 
	// 	let data = result.data.QueryResult.Data.string;
	// 	console.log(data);
	// 	console.log(nowTime());
	// console.log('------完成-------');
}


// let postData = {
// 	'operType': 1,
// 	'msisdn': '17299517690',
// 	'whiteNumber': '18503796066',
// }
// let postData = {
// 	'operType': 1,
// 	'msisdn': '17299517003',
// 	'whiteNumber': '17597981099',
// }
// voice_add(postData)

// 1.查询白名单列表
// voice_list(17299517015)

// 2.添加白名单
// let postData = {
// 	'operType': 1,
// 	'msisdn': '17299517015',
// 	'whiteNumber': '13353997393',
// }
// voice_add(postData)
voice_list(17299517015)
