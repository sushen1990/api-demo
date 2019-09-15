const validator = require('./index');

let body = { // 实际提交的post
	"Scode": "59bcd938f45b87c46bfd49d71",
	"studnet_mobile": "1561771987",
	"studnet_id": "156177198771",
}


let plan_list = { // 计划要验证的参数和是否必须
	'Scode': true,
	'studnet_id': true,
	'user_mobile': false,
	'studnet_mobile': false,
}

const {
	errors,
	isValid,
	trueList
} = validator(plan_list, body)

console.log(errors)
console.log(isValid)
console.log(trueList)
