//学生id绑定定位卡
exports.student_bindLBSCard = function(req, res) {
	var studentId = req.body.studentId;
	var cardNum = req.body.cardNum;
	if (!cardNum || !studentId) {
		return res.json({
			status: false,
			message: 'no cardNum or studentId'
		});
	}
	db.findStudentById(studentId, function(err0, doc0) {
		if (err0) {
			return res.json({
				status: false,
				message: err0
			});
		}
		if (!doc0) {
			return res.json({
				status: false,
				message: 'no student data'
			});
		}
		if(!doc0.parents||doc0.parents.length==0){
			return res.json({
				status: false,
				message: '该学生未绑定家长，暂时不能绑定定位卡'
			});
		}
		if(doc0.mobile && doc0.mobile.length>0){
			return res.json({
				status: false,
				message: '该学生已经绑定过定位卡，不能重复绑定'
			});
		}
		// var parentIds = [];
		// var ObjectID = req.mongo.ObjectID;
		// doc0.parents.forEach(parent => {
		// 	parentIds.push(new ObjectID(parent))
		// });
		userDB.parentList(doc0.parents,function(err, users){
			var unumber;
			var keynum;
			users.forEach(user => {
				if(user._id == doc0.parents[0]){
					unumber = user.mobile;
				}
				if(keynum){
					keynum = keynum+","+user.mobile;
				}else{
					keynum = user.mobile;
				}				
			});
			var url = "http://www.ts10000.net/intf/open/user_add.php?";
			var key = "78a83e3be0e2be4cb1695167749f2b3a";
			url = url+"key="+key;
			url = url+"&name="+encodeURIComponent(doc0.truename+"的家长");
			var md5 = crypto.createHash('md5');
			var stringMd5 = md5.update("123456").digest('hex').toUpperCase();
			url = url+"&pwd="+stringMd5;
			url = url+"&number="+unumber;
			url = url+"&tnumber="+cardNum;
			url = url+"&tname="+encodeURIComponent(doc0.truename);
			url = url+"&type=1";
			request.get(url,function(err,result,body){
				console.log("err#####",err)
				if (err) {
					return res.json({
						status: false,
						message: err
					});
				}
				console.log(body)
				body = JSON.parse(body);
				if(body.status===0){
					db.bindLBSCard(studentId, cardNum, function(err, result) {
						if (err) {
							return res.json({
								status: false,
								message: err
							});
						}
						if(keynum && keynum.length>0){//设置亲情号
							var newUrl ="http://www.ts10000.net/intf/open/terminal_edit.php?key=78a83e3be0e2be4cb1695167749f2b3a";
							newUrl = newUrl+"&number="+cardNum;
							newUrl = newUrl+"&keynum="+keynum;
							request.get(newUrl,function(err,result,body){
								console.log("err#####",err)
							})
						}
						res.json({
							status: true,
							resources: result
						});
					});
				}else{
					res.json({
						status: false,
						message: body.msg
					});
				}
			});
		});
	});
}