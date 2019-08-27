'use strict';
const util = require('util');
const async = require('async');
const mongoose = require('mongoose')
require('mongoose-long')(mongoose);
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;
const studentDB = require("./studentModel.js")
const moment = require('moment');

//定义Order对象模型
var OrderSchema = new Schema({
	//订购商品类型 在价格文件里面设置价格
	goods_type: {
		type: String,
		default: "locationDevice"
	},
	// 商品内容 单位：month 
	goods_item: {
		type: Array,
		default: []
	},
	//支付类型 1 alpay 支付宝支付 2 wxpay 微信支付 3 cash 现金支付 4 in 内部基金会小学 5 orther 其他
	trade_type: {
		type: String,
		default: ''
	},
	//订单状态 _created 创建订单等待付款 _paid 已经支付 
	status: {
		type: String,
		default: '_created'
	},
	//订购人id
	userId: {
		type: String,
		default: ''
	},
	//订购人手机号
	mobile: {
		type: SchemaTypes.Long,
		default: 0
	},
	//学生id
	studentId: {
		type: String,
		default: ''
	},
	//订购时间
	creatTime: {
		type: SchemaTypes.Long,
		default: Date.now()
	},
	//订单生效时间
	efftiveDate: {
		type: SchemaTypes.Long,
		default: 0
	},
	//支付订单号
	out_trade_no: {
		type: String,
		default: ''
	},
	// 支付的接口回调数据
	pay_return: {
		type: Array,
		default: null
	}
});

//访问对象模型
mongoose.model("Order", OrderSchema);
var Order = mongoose.model("Order");

// 保存订单
exports.SaveNew = function(postData, callback) {
	let newOrder = new Order();

	newOrder.goods_item = postData.goods_item;
	newOrder.trade_type = postData.trade_type;
	newOrder.out_trade_no = postData.out_trade_no;

	newOrder.userId = postData.userId;
	newOrder.mobile = postData.mobile;
	newOrder.studentId = postData.studentId;


	// save订单信息 start ↓
	newOrder.save(function(err) {
		if (err) {
			return callback(err);
		}
		callback(null, newOrder);
	});
	// save订单信息 end   ↑
}

// 查询订单
exports.findOrderBywhereStr = function(whereStr, callback) {

	Order.findOne(whereStr, function(err, doc) {
		if (err) {
			return callback(err, null);
		};
		if (!doc) {
			return callback(err, {
				msg: 'no',
				data: "数据库没有数据",
			});
		}
		callback(null, result = {
			msg: 'yes',
			data: doc,
		});
	});
}

// 更新数据，默认这里的 condition 都是已经经过确认的！
exports.updateOrderBywhereStr = function(condition, doc, callback) {
	Order.updateMany(condition, doc, function(err1, doc1) {
		if (err1) {
			return callback(err1);
		};
		let result = {
			msg: 'yes',
			data: doc2,
		};
		return callback(err, result)
	})
}

// 更新订单，并且更新学生的设备时间
exports.updateOrderAndStudentDevice = function(condition, doc, callback) {

	//  查找order
	Order.findOne(condition, function(err, result) {

		if (err) {
			return callback(err, null);
		};
		if (!result) {
			return callback(null, {
				msg: 'no',
				data: "orderDB数据库没有数据" + condition,
			});
		}

		//  更新order
		Order.updateOne(condition, doc, function(err1, result1) {
			if (err1) {
				return callback(err1);
			};

			// 查找student
			let studentId = result.studentId;
			studentDB.findStudentByWhereStr({
				_id: studentId
			}, function(err2, result2) {
				if (err2) {
					return callback(err, null);
				};
				if (!result2) {
					return callback(null, {
						msg: 'no',
						data: "studentDB没有数据！",
					});
				}

				// 更新student
				let addMonth = result.goods_item[0].month;
				let existsExpireDate = result2.expireDate;
				existsExpireDate = parseInt(existsExpireDate);
				let expireDate = existsExpireDate == 0 ? Date.now() : existsExpireDate;
				let nextExpireDate = moment(expireDate).add(addMonth, "month").valueOf();


				let doc1 = {
					expireDate: nextExpireDate,
					isInEffective: true
				}
				studentDB.updateStudentBywhereStr({
					_id: studentId
				}, doc1, function(err3, result3) {
					if (err3) {
						return callback(err, null);
					};
					if (result3.msg == "no") {
						return callback(null, {
							msg: 'no',
							data: result3.data
						});
					}
					callback(null, {
						msg: 'yes',
						data: result3.data,
					});
				})
			})
		})
	})
}
