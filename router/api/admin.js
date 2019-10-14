const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const adminDB = require('../../models/adminModel');
const Helper = require('../../common/helper');
const validator = require('../../validator/index');
const config = require('../../config/keys')

// @route  POST api/admin/
// @desc   测试是否联通
// @access public
router.get('/', (req, res) => {
	let nowTime = Helper.NowTime();
	res.json({
		'msg': 'ok',
		'info': 'got_it',
		'data': null,
		nowTime,
	})
})

// @route  POST api/admin/regi
// @desc   注册管理员
// @access public

router.post('/regi', (req, res) => {
	let nowTime = Helper.NowTime();
	// 0. 参数验证
	let plan_list = { // 计划要验证的参数和是否必须
		'name': true,
		'password': true,
		'Scode': true
	};
	const {
		errors,
		isValid,
		trueList
	} = validator(plan_list, req.body)
	if (!isValid) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: errors,
			nowTime
		})
	}

	let name = trueList.name;
	let password = trueList.password;
	let err_info = ''
	adminDB.findOne({
			name
		})
		.then(admin => { // 1. 查询name是否已经注册
			if (admin) {
				err_info = 'already_exists'
				throw new Error('already_exists');
			};
			var salt = bcrypt.genSaltSync(10); // 2. 加密密码
			var hash = bcrypt.hashSync(password, salt);

			var newAdmin = new adminDB(); // 3. 注册用户
			newAdmin.name = name;
			newAdmin.password = hash
			return newAdmin.save();
		})
		.then(result => {
			res.json({ // 4. 正常返回数据
				msg: 'ok',
				info: 'recently_saved',
				data: result,
				nowTime,
			})
		})
		.catch(err => {
			return res.json({
				msg: 'no',
				info: err_info === '' ? 'err' : err_info,
				data: err,
				nowTime,
			})
		})
})

// @route  POST api/admin/login
// @desc   返回token jwt passport
// @access public
router.post('/login', (req, res) => {
	let nowTime = Helper.NowTime();
	// 0. 参数验证
	let plan_list = { // 计划要验证的参数和是否必须
		'name': true,
		'password': true,
	};
	const {
		errors,
		isValid,
		trueList
	} = validator(plan_list, req.body)
	if (!isValid) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: errors,
			nowTime
		})
	}

	let name = trueList.name;
	let password = trueList.password;
	let err_info = ''
	adminDB.findOne({
			name,
		})
		.then(admin => { // 1. 查询name是否已经注册
			if (!admin) {
				err_info = 'not_extsis'
				throw new Error('not_extsis');
			};
			var isMatch = bcrypt.compareSync(password, admin.password); // 2. 比较密码

			if (!isMatch) {
				err_info = 'expired_data'
				throw new Error('expired_data');
			}

			// 3. 获取token 过期时间
			var rules = {
				'id': admin.id,
				'name': admin.name,
				'password': admin.password,
			}
			var secretOrKey = config.secretOrKey;
			// 失效时间
			const token = jwt.sign(rules, secretOrKey, {
				expiresIn: 10
			});
			res.json({
				msg: 'ok',
				info: 'got_it',
				data: {
					'token': 'Bearer ' + token
				},
				nowTime,
			})

		})
		.catch(err => {
			return res.json({
				msg: 'no',
				info: err_info === '' ? 'err' : err_info,
				data: err,
				nowTime,
			})
		})


})

// @route  POST api/admin/info
// @desc   验证token返回信息
// @access private
router.get('/info',
	passport.authenticate('jwt', {
		session: false
	}), (req, res) => {
		// passport.authenticate 使用passport验证，验证通过以后才会进行下面的代码
		// 注意这里必须是req.user
		res.json({
			'id': req.user.id,
			'name': req.user.name,
			'creat_at': req.user.creat_at,
		});
	})

module.exports = router;
