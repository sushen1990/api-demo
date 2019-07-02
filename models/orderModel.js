'use strict';
var util = require('util');
var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//定义SmsOrder对象模型
var OrderSchema = new Schema({
	topModelId: {
		type: String,
		default: ''
	},
	//订购商品类型 在价格文件里面设置价格
	goods_type: {
		type: Number,
		default: 0
	},
	// 支付方式 wxpay alipay 
	pay_type:{
		type: String,
		default : ''
	},
	//订单状态 0 创建订单 1 待支付 2 已支付 -1 作废
	state: {
		type: Number,
		default: 0
	},
	//订购人id
	userId: {
		type: String,
		default: ''
	},
	//订购人手机号
	mobile: {
		type: String,
		default: ''
	},
	//学生id
	studentId: {
		type: String,
		default: ''
	},
	//订购时间
	sendTime: {
		type: Number,
		default: 0
	},
	//订单来源(如：祥东)
	resource: {
		type: String,
		default: ''
	},
	//第三方订单号
	three_transaction_id: {
		type: String,
		default: ''
	}
});

//访问对象模型
mongoose.model("SmsOrder", OrderSchema);
var Order = mongoose.model("SmsOrder");

let time = new Date().getTime();

exports.findOrderToPay = function(callback) {
	Order.find({
		state: "1"
	}, function(err,doc){
		if (err) {
			return callback(err, null)
		}else if (doc){
			console.log(doc);
			callback(null, doc)
		}
	})
}