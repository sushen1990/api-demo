const stringRandom = require('string-random');
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

// 检测是否为手机号 数据错误返回true  数据正常返回false
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


// 生成6位数字随机验证码
exports.int6 = function() {
	var Num = "";
	for (var i = 0; i < 6; i++) {
		Num += Math.floor(Math.random() * 10);
	}
	return Num;

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

 exports.getDateString = function(date,type) {
	// 返回 YYYY-MM-DD hh:mm:ss
	// type 精确到 year month day full
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
	
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
	let currentdate = "";
	switch(type) {
		case "year":
			currentdate = date.getFullYear();
			break;
		case "month":
			currentdate = date.getFullYear() + seperator1 + month;
			break;
		case "day":
			currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
			break;
		case "full":
			currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();					
	}
    return currentdate;
}


// 生成唯一订单号
exports.getPayOrderNo = function(type){
	var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHour = date.getHours();	
	var strMinutes = date.getMinutes();
	var strSeconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
	var currentdate = "";
    currentdate = date.getFullYear()  + month  + strDate + strHour + strMinutes + strSeconds + type +stringRandom(8, { letters: false })
	
	return currentdate;
}

// 转换本地时间
exports.localDate = function(v) {
    const d = new Date(v || Date.now());
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString();
}