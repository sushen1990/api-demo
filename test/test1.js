let list = {
	'key ': ' 1 ',
	'name   ': ' 123123 ',
	'wer':''
}
// console.log(Object.keys(list))

// Object.keys(list).forEach(item)

let new_list = {};
for (let key in list) {
	new_list[key.trim().toString()] = list[key].trim();
}
console.log(list);
console.log(new_list);
