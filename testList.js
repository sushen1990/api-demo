// const XiangDongHelper = require('../../common/XiangDongHelper')
const XiangDongHelper = require('./common/XiangDongHelper')
const moment = require('moment');
// let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS')

function nowTime() {
	return moment().format('YYYY-MM-DD HH:mm:ss.SSS')
}

async function voice_list() {
	console.log(nowTime());
	var mobile = '17299517003';
	let result = await XiangDongHelper.voice_list(mobile);
	result = JSON.stringify(result);
	result = JSON.parse(result);
	if (result.err === '0') {
		console.log('失败');
		return
	}
	if (result.data.QueryResult.ErrorCode != '0') {
		console.log('参数错误');
		return
	}

	let data = result.data.QueryResult.Data.string;
	console.log(data);
	console.log(nowTime());
}

// console.log(1);
voice_list()
// console.log(2);
