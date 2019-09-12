const OrderDB = require('../models/orderModel')

async function load() {
	console.log(123)
	let res = await OrderDB.order_unpaid_list();
	console.log(1233)
	console.log(res)
}
// load()

function getInfo() {
	// let order = OrderDB.Order;
	// console.log(OrderDB.Order)
	let query = {
		// "creatTime": {
		// 	"$gt": time
		// },
		"status": "_created"
	}
	OrderDB.Order.find().exec().then(function(orders) {
		console.log(12)
		console.log(typeof(orders))
		// resolve(orders)
	}).catch((err) => {
		console.log(err)
	})
}
// getInfo()
