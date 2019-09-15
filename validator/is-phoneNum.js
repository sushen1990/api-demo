const isPhoneNum = value => {

	let reg = /^1[0-9]{10}$/;
	value = value.toString().trim();
	return value.length === 11 && reg.test(value)
}

module.exports = isPhoneNum;
