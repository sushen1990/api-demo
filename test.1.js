exports.user_webLogin_code = function(req, res) {
	var modelId = req.body.modelId;
	var mobile = req.body.mobile;
	if (!mobile) {
		return res.json({
			status: false,
			message: 'no mobile'
		})
	}
	if (!modelId) {
		return res.json({
			status: false,
			message: 'no modelId'
		})
	}
	var verificationCode = req.body.verificationCode;
	if (!verificationCode) {
		return res.json({
			status: false,
			message: 'no verificationCode'
		});
	}
	//先校验验证码
	verificationCodeDB.findCodeByMobile(mobile, modelId, function(err, result) {
		if (err) {
			return res.json({
				status: false,
				message: err
			})
		}
		if (!result) {
			return res.json({
				status: false,
				message: '验证码错误或已失效，请重新获取验证码'
			})
		}
		if (result.code != verificationCode) {
			return res.json({
				status: false,
				message: '验证码错误，请重新获取验证码'
			})
		}
		var nowTime = new Date().getTime();
		if (result.code == verificationCode && result.time < nowTime) {
			return res.json({
				status: false,
				message: '验证码已失效，请重新获取验证码'
			})
		}
		//开始获取用户
		userDB.findUserByMobile(mobile, modelId, 1, function(err0, doc0) {
			if (err0) {
				return res.json({
					status: false,
					message: err0
				})
			}
			if (!doc0) {
				return res.json({
					status: false,
					message: '没有查询到该手机号，如您绑定的手机号码已更换，请联系我们'
				})
			}
			var newObj = {
				"_id": doc0._id,
				"truename": doc0.truename,
				"nickname": doc0.nickname,
				"mobile": doc0.mobile,
				"roleId": doc0.roleId,
				"roleName": doc0.roleName,
				"companyId": doc0.companyId,
				"companyName": doc0.companyName,
				"modelId": doc0.modelId,
				"lastLoginTime": doc0.lastLoginTime,
				"lastLoginWay": doc0.lastLoginWay,
				"cardID": doc0.cardID,
				"createDate": doc0.createDate,
				"openid": doc0.openid,
				"wechatSubscribeDate": doc0.wechatSubscribeDate,
				"wechatSubscribe": doc0.wechatSubscribe,
				"channelId": doc0.channelId,
				"channelName": doc0.channelName,
				"agentId": doc0.agentId,
				"agentTrueName": doc0.agentTrueName,
				"sex": doc0.sex,
				"city": doc0.city,
				"province": doc0.province,
				"country": doc0.country,
				"headimgurl": doc0.headimgurl,
				"note": doc0.note,
				studentInfo: {},
				classInfo: {},
				schoolInfo: {}
			}

			//开始获取学生班级学校等信息
			studentDB.findStudentByParentUserId(doc0._id, modelId, function(err1, result) {
				var uri = config.webServerHost + ':' + config.webServerPort;
				if (config.webServerPort == 80) {
					uri = config.webServerHost;
				}
				if (err1) {
					return res.json({
						status: true,
						resources: newObj
					});
				}
				if (!result) {
					return res.json({
						status: true,
						resources: newObj
					});
				}
				newObj.studentInfo = result; //添加学生信息
				if (result.headimgurl && !newObj.headimgurl) {
					newObj.headimgurl = result.headimgurl;
				}
				if (!result.headimgurl && !newObj.headimgurl) {
					var img_url = uri + '/images/user.png';
					newObj.headimgurl = img_url;
					newObj.studentInfo.headimgurl = uri + '/images/user2.png';
				}
				//查询班级信息
				classDB.findClassById(result.classId, function(err2, result2) {
					if (err2) {
						return res.json({
							status: true,
							resources: newObj
						});
					}
					if (!result2) {
						return res.json({
							status: true,
							resources: newObj
						});
					}
					newObj.classInfo = result2; //添加班级信息
					//查询学校信息
					schoolDB.findSchoolById(result2.schoolId, function(err3, result3) {
						if (err3) {
							return res.json({
								status: true,
								resources: newObj
							});
						}
						if (!result3) {
							return res.json({
								status: true,
								resources: newObj
							});
						}
						newObj.schoolInfo = result3; //添加学校信息
						res.json({
							status: true,
							resources: newObj
						});
						//老接口不再更新积分 rain-2017年12月27日15:16:30
					});
				});
			});
		});
	});
}