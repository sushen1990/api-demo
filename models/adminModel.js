
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird');
require('mongoose-long')(mongoose); // 使用mongoose 整数类型
const SchemaTypes = mongoose.Schema.Types;


// 创建数据结构

const AdminSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	creat_at: {
		type: SchemaTypes.Long,
		default: Date.now()
	}
});


var Admin = mongoose.model('admin', AdminSchema);
//promise化user类及其方法
// Promise.promisifyAll(Admin);
// Promise.promisifyAll(Admin.prototype);
module.exports = Admin;