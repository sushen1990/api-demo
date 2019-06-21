

// 检测是否为6位数字验证码
// function checkVerifyCode(verifyCode){
// 	let reg = /[0-9]{6}$/;
// 	if(verifyCode!="" && verifyCode!=undefined && verifyCode.length==6 && reg.test(verifyCode)){
// 		return true
// 	}else{
// 		return false
// 	}
// 	
// }

// 检测是否为手机号
exports.checkTel = function(tel){
		
	let reg = /^1[0-9]{10}$/;
	if(tel!="" && tel!=undefined && tel.length==11 && reg.test(tel)){
		return true
	}else{
		return false
	}
}

// 获取当前时间 格式YYYY-MM-DD
// function getNow() {
//   var date = new Date();
//   var seperator1 = "-";
//   var year = date.getFullYear();
//   var month = date.getMonth() + 1;
//   var strDate = date.getDate();
//   if (month >= 1 && month <= 9) {
//     month = "0" + month;
//   }
//   if (strDate >= 0 && strDate <= 9) {
//     strDate = "0" + strDate;
//   }
//   var currentdate = year + seperator1 + month + seperator1 + strDate;
//   return currentdate;
// };


