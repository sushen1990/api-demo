// 检查是否为空、null、undefined   数据正常返回false 数据错误返回true
exports.checkReal = function(str) {
	if (!str || str == "" || str == undefined) {
		return true;
	} else {
		return false;
	}
}

// 检测是否为6位数字验证码
exports.checkVerifyCode = function(verifyCode) {
	let reg = /[0-9]{6}$/;
	if (verifyCode != "" && verifyCode != undefined && verifyCode.length == 6 && reg.test(verifyCode)) {
		return true
	} else {
		return false
	}

}

// 生成6位数字随机验证码
exports.int6 = function() {
	var Num = "";
	for (var i = 0; i < 6; i++) {
		Num += Math.floor(Math.random() * 10);
	}
	return Num;

}

// 检测是否为手机号 数据正常返回false 数据错误返回true
exports.checkTel = function(tel) {
	let reg = /^1[0-9]{10}$/;
	if (tel != "" && tel != undefined && tel.length == 11 && reg.test(tel)) {
		return false
	} else {
		return true
	}
}

// 随机32字符串
exports.str32 = function() {
	var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	/*ABCDEFGHIJKLMNOPQRSTUVWXYZ*/
	var maxPos = chars.length;
	var noceStr = "";
	for (var i = 0; i < 32; i++) {
		noceStr = noceStr + chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return noceStr; //随机数
}

// YYYY-MM-DD HH:mm:ss
exports.getNowYtoS = function getNowFormatDate() {

    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}
