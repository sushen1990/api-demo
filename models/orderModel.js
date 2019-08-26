'use strict';
var util = require('util');
var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//定义SmsOrder对象模型
var OrderSchema = new Schema({
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
	//订单状态 _created 创建订单 1 待支付 2 已支付 3 订单正常完成 -1 作废
	state: {
		type: String,
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
	//订单生效时间，首次订购或者失效后重新订购为当天，订单还在生效的时候，顺延订单日期。
	efftiveDate: {
		type: Number,
		default: 0
	},
	//订单过期时间，到期状态更改为3 已完成
	expireDate: {
		type: Number,
		default: 0
	},
	//订单来源(如：祥东)
	resource: {
		type: String,
		default: ''
	},
	//支付订单号
	out_trade_no: {
		type: String, 
		default: ''
	},
	//支付类型 1 AL 支付宝支付 2 WX 微信支付 3 CA 现金支付 4 IN 内部基金会小学 5 OT 其他
	teade_type: {
		type: String, 
		default: ''
	}
});

//访问对象模型
mongoose.model("SmsOrder", OrderSchema);
var Order = mongoose.model("SmsOrder");

let time = new Date().getTime();

// 查找待支付订单
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

// 根据学生ID获取订单信息
exports.findOrderByStudentID = function(callback) {
	Order.find({
		state: "1",
		
	}, function(err,doc){
		if (err) {
			return callback(err, null)
		}else if (doc){
			console.log(doc);
			callback(null, doc)
		}
	})
}