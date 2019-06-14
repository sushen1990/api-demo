'use strict';
const express = require("express");
const router = express.Router();
const request = require('request');
 
router.post("/getLocationByTel", (req,res)=>{
	let mobile = req.body.mobile;
	let stime = req.body.stime;
	let etime = req.body.etime;
	
	if (!mobile || mobile == "" || mobile == undefined) {
        return res.status(400).json({msg: "定位卡终端手机号码不能为空！", data:null})
    }	
	let url = "http://www.ts10000.net/intf/open/locrecord_lists.php?";
	let key = "78a83e3be0e2be4cb1695167749f2b3a"; 
	url = url+"key="+key;
	url = url+"&tnumber="+mobile;
	
	if (stime && stime != "" || stime != undefined) {
        url = url+"&stime="+stime;
	}
	if (etime && etime != "" || etime != undefined) {
        url = url+"&etime="+etime;
	}
	
	request.get(url,(err,result,doc)=>{
		if(err){
			return res.status(500).json({ msg: "系统错误，代码！"+ err, data:null})
		}else{
			doc = JSON.parse(doc);
			if(doc.status == 0 && doc.msg == "操作成功" ){
				res.json({
					msg: "ok",
					data: doc.result
				});
			}else{
				res.status(500).json({ msg: "定位卡API系统错误，代码！"+ doc.msg, data:doc.result})
			}
		}
	})
	
})
 
module.exports = router;