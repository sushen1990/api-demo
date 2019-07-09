var helper = require("./common/helper")
let order = "5cd3aec5f002b6dc1664332e";
var time = new Date().toLocaleDateString()
time = new Date().toLocaleTimeString();
order = time + "-" + order.toUpperCase();

console.log(order)