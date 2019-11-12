const isEmpty = require("./is-empty");
const isPhoneNum = require("./is-phoneNum");
const config = require('../config/keys');


module.exports = function validatorData(plan_list, post_body_untrim) {

	let errors = {}; // 错误的原因
	let true_list = {}; // 真实的数据会记录并返回的
	
	
	// 0.1 优化post_body 进行trim处理
	let post_body = {};	
	for(let key in post_body_untrim){
		post_body[key.trim().toString()] = post_body_untrim[key].toString().trim();
	}

	// 0.2 整理数据
	let data = {};

	for (let key in plan_list) {
		console.log(post_body[key])
		data[key] = {
			'value': post_body[key], // 如果req.body中没有这个key，按照undefined处理
			'integral': plan_list[key] // 是否必要参数
		}
	}

	// 1. 验证Scode, Scode的判定为includes。即当前提交的Scode是否在预定的Scode组合里面。
	post_Scode = data['Scode']['value'] === undefined ? '' : data['Scode']['value'].trim();
	if (!config.Scode.includes(post_Scode)) {
		errors['Scode'] = 'Scode不合法';
		true_list['Scode'] = post_Scode;
		return {
			errors: errors,
			isValid: isEmpty(errors), // errors 无数据返回true ,errors 有数据返回 false
			true_list
		}
	}

	// 2. 根据key的值和[是否必须]去检查数据
	for (let key in data) {

		// 3 可选参数，没有在post中提交，直接跳过
		if (data[key]['integral'] === false) {
			true_list[key] = '';
			continue;
		} else {

			// 4 必须参数，一定得验证。可选参数提交的话，也得验证
			if (isEmpty(data[key]['value'])) { // 4.1  验证数据真实性
				errors[key] = key + '不合法';
				// break;
			}
			if (key.includes('mobile') || key.includes('phone')) { // 4.2 如果手机号，验证手机号
				if (!isPhoneNum(data[key]['value'])) {
					errors[key] = key + '必须为11数字'
					// break;
				}
			}
			if(key.includes('admin_code')){
				if(data[key]['value']!=='DklJ^8Km$C6gdWHsWRKp'){// 4.3 如果admin_code, 验证admin_code
					errors[key] = key + '错误'
					// break;
				}
			}
									
			true_list[key] = data[key]['value'];
		}
	}

	return {
		errors: errors,
		isValid: isEmpty(errors), // errors 无数据返回true ,errors 有数据返回 false
		true_list
	}

}
