
const express = require("express")
const router = express.Router()
const UserModel = require("../../models/User")

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
					 newUser.save()
					 	   .then(user => res.json(user))
					 	   .catch(err => res.json(err))
				 }
			 })
})




module.exports = router;