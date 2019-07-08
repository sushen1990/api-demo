function sayHi() {
	return "HI"
}

var a = "";
a = this.sayHi()

console.log(a)