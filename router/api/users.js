const express = require("express")
const router = express.Router()
const UserModel = require("../../models/testUser")
const bcrypt = require("bcrypt")

const userDB = require("../../models/userModel.js")
const studentDB = require("../../models/studentsModel.js")
const classDB = require("../../models/classModel.js")
const schoolDB = require("../../models/schoolModel.js")

// $route Get api/users/test
// @desc 测试接口是否连通
// @access pulic
router.get("/test",(req,res) =>{ 
    res.json({msg:"hello q"})
})

// $route Post api/users/regi
// @desc 注册
// @access pulic
router.post("/regi",(req,res) =>{

	// 去重查询
	UserModel.findOne({name:req.body.name})
			 .then(user => {
				 if(user){
					 return res.status(400).json({name:"已经被注册"})
				 }else{
					 const newUser = new UserModel({
					 	name:req.body.name,
					 	email:req.body.name,
					 	psd:req.body.name		
					 })
					 
				// 加密模式是10	 
				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(newUser.psd, salt, (err, hash) => {
						// Store hash in your password DB.
						if(err) throw err;
						newUser.psd = hash
						
						newUser.save()
							   .then(user => {
								   return res.status(200).json({result:user})
							   })
							   .catch(err => {
								   return res.status(300).json({result:err})
							   })						
					});
				});					 
					 
				 }
			 })
			 .catch(err => res.json(err))
})

// $route Post api/users/telLogin
// @desc 家长用户通过手机验证码登录   mobile modelId verifyCode
// @access pulic
router.post("/LoginParent", (req,res) =>{
	 
	let mobile = req.body.mobile;
	let modelId = req.body.modelId;
	let verifyCode = req.body.verifyCode;
	
	if (!mobile || mobile == "" || mobile == undefined) {
        return res.status(400).json({msg: "手机号码不能为空！", data:null})
    }
	if (!modelId || modelId == "" || modelId == undefined) {
        return res.status(400).json({msg: "关键值不能为空！", data:null})
    }
	// if (!verifyCode || verifyCode == "" || verifyCode == undefined) {
	//     return res.status(400).json({
	//         msg: "验证码不能为空！"
	//     })
	// }
	
	const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(mobile)) {
        return res.status(400).json({ msg: "请输入正确的手机号码！", data:null})
    }	

	userDB.findUserByMobile(mobile, modelId, 1, function(err0, doc0) {
		if (err0) {
			return res.status(404).json({msg: err0, data:null})
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
			
		// 开始获取学生班级学校等信息
		studentDB.findStudentByParentUserId(doc0._id, modelId, function(err1, result) {

			if (err1) {
				return res.json({
					msg: "ok",
					data: newObj
				});
			}
			if (!result) {
				return res.json({
					msg: "ok",
					data: newObj
				});
			}
			newObj.studentInfo = result; //添加学生信息

			//查询班级信息
			classDB.findClassById(result.classId, function(err2, result2) {
				if (err2) {
					return res.json({
						msg: "ok",
						data: newObj
					});
				}
				if (!result2) {
					return res.json({
						msg: "ok",
						data: newObj
					});
				}
				newObj.classInfo = result2; //添加班级信息
				//查询学校信息
				schoolDB.findSchoolById(result2.schoolId, function(err3, result3) {
					if (err3) {
						return res.json({
							msg: "ok",
							data: newObj
						});
					}
					if (!result3) {
						return res.json({
							msg: "ok",
							data: newObj
						});
					}
					newObj.schoolInfo = result3; //添加学校信息
					res.json({
						msg: "ok",
						data: newObj
					});
				});
			});
		
		});	
	})
})
module.exports = router;