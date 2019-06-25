

// 检测是否为6位数字验证码
exports.checkVerifyCode(verifyCode){
	let reg = /[0-9]{6}$/;
	if(verifyCode!="" && verifyCode!=undefined && verifyCode.length==6 && reg.test(verifyCode)){
		return true
	}else{
		return false
	}
	
}

// 生成6位数字随机验证码
exports.int6(){
	var Num=""; 
	for(var i=0;i<6;i++) 
	{ 
		Num+=Math.floor(Math.random()*10); 
	}
	return Num;
	
}

// 检测是否为手机号
exports.checkTel = function(tel){
		
	let reg = /^1[0-9]{10}$/;
	if(tel!="" && tel!=undefined && tel.length==11 && reg.test(tel)){
		return true
	}else{
		return false
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


