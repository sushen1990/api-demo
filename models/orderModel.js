'use strict';
const util = require('util');
const async = require('async');
const mongoose = require('mongoose')
require('mongoose-long')(mongoose);
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

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
	//订单过期时间，根据订单支付内容设置。当支付成功后，同步到student表中
	expireDate: {
		type: SchemaTypes.Long,
		default: 0
	},
	//支付订单号
	out_trade_no: {
		type: String,
		default: ''
	}
});

//访问对象模型
mongoose.model("Order", OrderSchema);
var Order = mongoose.model("Order");

// 保存订单信息
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


// 查询订单信息
exports.findBywhereStr = function(whereStr, callback) {
	Order.findOne(whereStr, function(err, doc) {
		let result = null;
		if (err) {
			return callback(err, null);
		};
		if (!doc) {
			result = {
				msg: 'no',
				data: "数据库没有数据",
			};
		} else {
			result = {
				msg: 'yes',
				data: doc,
			};
		};
		callback(null, result);
	});
}
// 查找待支付订单
exports.findOrderToPay = function(callback) {
	Order.find({
		state: "1"
	}, function(err, doc) {
		if (err) {
			return callback(err, null)
		} else if (doc) {
			console.log(doc);
			callback(null, doc)
		}
	})
}

// 根据学生ID获取订单信息
exports.findOrderByStudentID = function(callback) {
	Order.find({
		state: "1",

	}, function(err, doc) {
		if (err) {
			return callback(err, null)
		} else if (doc) {
			console.log(doc);
			callback(null, doc)
		}
	})
}
