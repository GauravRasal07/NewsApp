const  dateFormat = require('dateformat'),
	   dotenv     = require('dotenv'),
	   User       = require("../models/user"),
	   Task       = require("../models/news");

dotenv.config();

middleware = {};

middleware.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		next();
	}else{
		req.flash("error", "Please Login First!!!");
		res.redirect("/login");
	}
}

module.exports = middleware;