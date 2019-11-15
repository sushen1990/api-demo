'use strict';
const express = require("express");
const router = express.Router();
const schoolDB = require("../../models/schoolModel")
const config = require("../../config")
const Helper = require('../../common/helper');
const validator = require('../../validator/index');
const log4 = require('../../test/log4');
const logger = log4.getLogger("error");
// 测试接口是否连通
router.get("/test", (req, res) => {

	let now_time = Helper.NowTime();
	// logger.error('123')
	logger.error({
		now_time,
		content: '1231232'
	})
	res.json({
		msg: "hello school"
	})
})

// 添加学校
router.post('/school_add', (req, res) => {

	let now_time = Helper.NowTime();

	// 1. 验证参数	
	let plan_param = { // 1.1 计划要验证的参数和是为必须
		'Scode': true,
		'school_name': true,
		'address': true,
		'contact_name': true,
		'contact_mobile': true,
		'addres_first_stage': true,
		'addres_second_stage': true,
		'addres_third_stage': true,
	}
	const {
		errors,
		isValid,
		true_list
	} = validator(plan_param, req.body);

	// 2. 判断参数
	if (!isValid) {
		return res.json({
			'msg': 'no',
			'info': 'param_wrong',
			'data': errors,
			now_time
		})
	}

	let school_name = true_list['school_name'];
	let address = true_list['address'];
	let contact_name = true_list['contact_name'];
	let contact_mobile = true_list['contact_mobile'];
	let addres_first_stage = true_list['addres_first_stage'];
	let addres_second_stage = true_list['addres_second_stage'];
	let addres_third_stage = true_list['addres_third_stage'];

	// 2. 通过学校名查询是否已注册
	let query = {
		school_name
	};
	let info = '';

	schoolDB.findOne(query).then((find_school) => {
		if (find_school != null) { // 2.1 已经注册，获取已注册的学校信息
			info = 'already_exists';
			throw new Error('already_exists')
		}
		let newSchool = new schoolDB(); // 2.2 没有注册，注册新学校
		newSchool.school_name = school_name;
		newSchool.address = address;
		newSchool.contact_name = contact_name;
		newSchool.contact_mobile = contact_mobile;
		newSchool.addres_first_stage = addres_first_stage;
		newSchool.addres_second_stage = addres_second_stage;
		newSchool.addres_third_stage = addres_third_stage;
		newSchool.create_at = Date.now();
		newSchool.isShow = true;

		info = 'recently_saved';
		return newSchool.save();

	}).then((result) => {

		// 3. 返回数据
		res.json({
			'msg': 'ok',
			info,
			'data': result,
			now_time
		});
	}).catch((err) => {

		//  4. 记录err
		res.json({
			msg: 'no',
			info: info === '' ? err : info,
			data: null,
			now_time
		});
	})
})


// 学校分页查询
router.post('/school_list_page', (req, res) => {
	let now_time = Helper.NowTime();
	// 1. 验证参数
	let plan_param = { // 1.1 计划要验证的参数和是为必须
		'Scode': true,
		'size': 5,
		'page': 1,
	}
	const {
		errors,
		isValid,
		true_list
	} = validator(plan_param, req.body);

	// 2. 判断参数
	if (!isValid) {
		return res.json({
			now_time,
			'msg': 'fail',
			'info': 'param_wrong',
			'data': errors,
		})
	};
	let size = parseInt(true_list['size']);
	let page = parseInt(true_list['page']);

	if (size % 1 != 0 || page % 1 != 0 || page === 0 || size === 0) {
		return res.json({
			now_time,
			'msg': 'fail',
			'info': 'param_wrong',
			'data': 'page、size 必须为int',
		})
	}


	// 3. 查询
	let query = {
		'isShow': true
	};
	let info = '';
	schoolDB.find(query).limit(size).skip((page - 1) * size).sort({
		_id: -1
	}).then((result) => {
		res.json({
			now_time,
			'msg': 'success',
			'info': 'got_it',
			'data_count': result.length,
			'data': result,
		})
	}).catch((err) => {

		logger.error({
			now_time,
			err
		})

		//  4. 记录err
		res.json({
			now_time,
			'msg': 'fail',
			'info': info === '' ? err : info,
			'data': null,
		});
	})

})



// 新增学校
router.post("/schoolAdd", (req, res) => {
	let Scode = req.body.Scode;
	let schoolName = req.body.schoolName;
	let proviceFirstStageName = req.body.proviceFirstStageName;
	let addressCitySecondStageName = req.body.addressCitySecondStageName;
	let addressCountiesThirdStageName = req.body.addressCountiesThirdStageName;
	let address = req.body.address;
	let contacts = req.body.contacts;
	let contactsPhone = req.body.contactsPhone;
	let schoolType = req.body.schoolType;
	let position = req.body.position;
	let info = req.body.info;
	let imageUrl = req.body.imageUrl;

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	}
	if (Helper.checkReal(schoolName)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少值schoolName"
		})
	}
	if (Helper.checkTel(contactsPhone)) {
		return res.status(400).json({
			msg: "no",
			data: "手机号码格式不正确!"
		})
	};
	// 去重查询
	schoolDB.findSchoolByName(schoolName, function(err, doc) {

		if (doc) {
			return res.status(403).json({
				msg: "no",
				data: "当前学校名已经被注册"
			})
		}

		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!"
			})
		}
		const postData = {
			schoolName: schoolName,
			proviceFirstStageName: proviceFirstStageName,
			addressCitySecondStageName: addressCitySecondStageName,
			addressCountiesThirdStageName: addressCountiesThirdStageName,
			address: address,
			contacts: contacts,
			contactsPhone: contactsPhone,
			schoolType: schoolType,
			position: position,
			info: info,
			imageUrl: imageUrl
		}

		schoolDB.schoolSave(postData, function(err, result) {
			if (err) {
				return res.status(500).json({
					msg: "no",
					data: "服务器内部错误,请联系后台开发人员!!!"
				})
			}
			let data = result;
			res.json({
				msg: "ok",
				resources: data
			})

		})
	})
})


// 获取学校列表
router.post("/schoolList", (req, res) => {
	let Scode = req.body.Scode;

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	}
	schoolDB.getSchoolList(function(err, doc) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!"
			})
		}
		if (!doc) {
			return res.status(404).json({
				msg: "no",
				data: "没有数据！"
			})
		}
		let data = doc;
		res.status(200).json({
			msg: "ok",
			data: data
		})
	})
})

// 分页获取学校
router.post("/schoolListPage", (req, res) => {
	let Scode = req.body.Scode;
	let page = req.body.page;
	let size = req.body.size;

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	}
	if (Helper.checkReal(page)) {
		return res.status(400).json({
			msg: "no",
			data: "page错误"
		})
	}
	if (Helper.checkReal(size)) {
		return res.status(400).json({
			msg: "no",
			data: "size错误"
		})
	}
	schoolDB.getSchoolListPaginate(page, size, function(err, doc) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			})
		}
		if (!doc) {
			return res.status(404).json({
				msg: "no",
				data: "没有数据！"
			})
		}
		let data = doc;
		res.status(200).json({
			msg: "ok",
			data: data
		})
	})
})


// 删除学校
router.post("/schoolRemove", (req, res) => {
	let Scode = req.body.Scode;
	let schoolID = req.body.schoolID;

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	}
	if (Helper.checkReal(schoolID)) {
		return res.status(400).json({
			msg: "no",
			data: "schoolID错误"
		})
	}

	schoolDB.schoolRemove(schoolID, function(err, doc) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!"
			})
		}
		if (!doc) {
			return res.status(404).json({
				msg: "no",
				data: "没有数据！"
			})
		}
		let data = doc;
		res.status(200).json({
			msg: "ok",
			data: data
		})
	})
})
module.exports = router;
