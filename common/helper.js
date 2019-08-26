const stringRandom = require('string-random');
const moment = require('moment');



// 复核相关 ---------------------------------------------------------------start ↓

// 检查是否为空、null、undefined   数据错误返回true  数据正常返回false
exports.checkReal = function(str) {
	if (str == null || str == "" || str == undefined) {
		return true;
	} else {
		return false;
	}
}

// 检测是否为手机号 数据错误返回true  数据正常返回false
exports.checkTel = function(tel) {
	if (tel == null || tel == undefined || tel == "") {
		return true;
	}
	let reg = /^1[0-9]{10}$/;
	tel = tel.toString();
	if (tel.length == 11 && reg.test(tel)) {
		return false;
	} else {
		return true;
	}
}

// 检测是否为验证码 数据错误返回true  数据正常返回false
exports.checkVeryfiCode = function(veryfiCode) {
	if (veryfiCode == null || veryfiCode == undefined || veryfiCode == "") {
		return true;
	}
	let reg = /^[0-9]{6}$/;
	veryfiCode = veryfiCode.toString();
	if (veryfiCode.length == 6 && reg.test(veryfiCode)) {
		return false;
	} else {
		return true;
	};
}

// 复核相关 ---------------------------------------------------------------  end ↑



// 生成字段 ---------------------------------------------------------------start ↓

// 生成6位数字随机验证码
exports.int6 = function() {
	var Num = "";
	for (var i = 0; i < 6; i++) {
		Num += Math.floor(Math.random() * 10);
	}
	return Num;

}

// 生成指定长度随机字符串
exports.randomStr = function(length) {
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	/*ABCDEFGHIJKLMNOPQRSTUVWXYZ*/
	var maxPos = chars.length;
	var noceStr = "";
	for (var i = 0; i < length; i++) {
		noceStr = noceStr + chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return noceStr; //随机数
}

// 生成日期字符串YYYY-MM-DD HH:mm:ss
exports.getDateStringWithMoment = function() {
	let time = moment.unix(Date.now() / 1000).format("YYYY-MM-DD HH:mm:ss");
	return time; //随机数
}



// 生成字段 ---------------------------------------------------------------  end ↑
