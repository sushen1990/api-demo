 const router = express.Router()
 
 const bannerDB = require("../../models/bannerModel.js")
 
 router.post("/bannerList", (req,res)=>{
	 
	let modelId = req.body.modelId;
	if (!modelId || modelId == "" || modelId == undefined) {
        return res.status(400).json({msg: "关键值不能为空！", data:null})
    }
	let page = req.body.page;
	let size = req.body.size;
	if (!page) {
		page = 1;
	}
	if (!size) {
		size = 2;
	}
	
	bannerDB.bannerAll(modelId, page, size, function(err, row) {
		if (err) {
			return res.status(500).json({ msg: "系统错误，代码！"+ err, data:null})

		}
		res.status(200).json({
			msg: "ok",
			data: row.doc
		});
	 })
 })


module.exports = router;