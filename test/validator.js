const validator = require('../validator/index');

let plan_param = { // 1.1 计划要验证的参数和是为必须
	'Scode': true,
	'school_name': true,
	'address': true,
	'contact': true,
	'contact_mobile': true,
	'addres_first_stage': true,
	'addres_second_stage': true,
	'addres_third_stage': true,
}


body = {
	'Scode': '59bcd938f45b87c46bfd49d7',
	"school_name": "小学",
	"addres_first_stage": "河南省",
	"addres_second_stage": "周口市",
	"addres_third_stage": "大侠",
	"address": "韩林柳",
	"contact": "",
	"contact_mobile": "15617719878",
}

const {
	errors,
	isValid,
	trueList
} = validator(plan_param, body);

console.log(errors)
