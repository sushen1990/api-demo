
const express = require("express")
const router = express.Router()
const UserModel = require("../../models/User")
const bcrypt = require("bcrypt")

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
// @desc 通过手机号、验证码登录
// @access pulic
router.post("/getUser", (req,res) =>{
	if(req.body.name==1){
		
	}
})


module.exports = router;