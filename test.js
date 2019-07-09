var helper = require("./common/helper")
const stringRandom = require('string-random');

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
    var currentdate = date.getFullYear()  + month  + strDate + strHour + strMinutes + strSeconds + "WX" +stringRandom(8, { letters: false })

// console.log(currentdate)
console.log(currentdate)