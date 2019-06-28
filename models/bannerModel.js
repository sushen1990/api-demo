var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BannerSchema = new Schema({
	modelId: {
		type: String,
		default: null
	},
	imgurl: {
		type: String,
		default: null
	},
	//标题
	title: {
		type: String,
		default: null
	},
	//Banner类型 map=['首页','微公益','微团购','优培课']
	type: {
		type: String,
		default: 0
	},
	//是否删除
	isShow: {
		type: Boolean,
		default: false
	},
	//是否显示该Banner
	display: {
		type: Boolean,
		default: false
	},
	//Banner开始时间
	dateBegin: {
		type: Number,
		default: null
	},
	//Banner结束时间
	dateEnd: {
		type: Number,
		default: null
	},
	//链接
	url: {
		type: String,
		default: null
	},
	//商品
	goods_id: {
		type: String,
		default: null
	},
	//活动商品
	goodsActivity_id: {
		type: String,
		default: null
	},
	//网页内容
	infoHtml: {
		type: String,
		default: null
	},
	//关联学校ID
	schoolId: {
		type: String,
		default: ''
	}
});

//访问Banner对象模型
mongoose.model('Banner', BannerSchema);
var Banner = mongoose.model('Banner');

//所有Banner列表
exports.bannerAll = function(modelId, d1, d2, callback) {
	var page = parseInt(d1);
	var size = parseInt(d2);
	Banner.find({
		isShow: true,
		topModelId: modelId
	}, function(err, doc) {
		if (err) {
			util.log('FATAL' + err);
			return callback(err, null);
		}
		Banner.count_documents({
			isShow: true,
			modelId: modelId
		}, function(err2, total) {
			if (err2) {
				util.log('FATAL ' + err2);
				return callback(err2, null);
			}
			var newDoc = {
				doc: doc,
				total: total
			}
			callback(null, newDoc);
		})
	}).limit(size).skip((page - 1) * size).sort({
		dateBegin: -1
	})
}