const express = require("express")
const router = express.Router()
const innerHtmlModel = require("../../models/innerHtmls")

router.get("/",(req,res) =>{

	User.find({},function(err,docs){
		if(err){
			res.json({
				success:'fail',
				data:null
			})
		}else{
			res.json({
				success:'true',
				data:docs
			})
		}
	})
	
})

router.post("/add",(req,res) =>{
	const newInerHtml = new innerHtmlModel({
		innerHtml: req.body.innerHtml
	})

	newInerHtml.save()
			   .then(user => res.json(user))
			   .catch(err => res.json(err))	
})

module.exports = router;