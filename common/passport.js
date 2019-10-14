const JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");
const adminDB = mongoose.model("admin");
const config = require("../config/keys");
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretOrKey;

module.exports = passport => {
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		// console.log(jwt_payload);
		// jwt_payload 就是之前的rule里面的数据
		adminDB.findById(jwt_payload.id)
			.then(admin => {
				if (admin) {
					return done(null, admin);
				}

				return done(null, false);
			})
			.catch(err => console.log(err));
	}));
}
