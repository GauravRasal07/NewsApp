const bodyParser 		    = require("body-parser"),
	  methodOveRide		    = require("method-override"),
	  passport    		    = require("passport"),
	  localStrategy	 	    = require("passport-local"),
	  passportLocalMongoose = require("passport-local-mongoose"),
	  express   			= require("express"),
	  flash				    = require("connect-flash"),
	  dotenv 				= require('dotenv'),
      crypto                = require('crypto'),
      axios                 = require("axios").default,
	  User                  = require("./models/user"),
	  middleware            = require("./middleware"),
	  app       			= express();

dotenv.config();
require('./passport-configure');

const mainRoutes    = require("./routes/index"),
	  authRoutes   = require("./routes/auth");

const mongoose	   = require('mongoose');

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(require("express-session")({
	secret : "This is the News App",
	resave : false,
	saveUninitialized : false
}));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(flash());

app.use(express.static(__dirname + "/public/"));

app.use(methodOveRide("_method"));

passport.use(new localStrategy(User.authenticate()));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
    res.locals.articles    = req.articles;
	res.locals.error	   = req.flash("error");
	res.locals.success	   = req.flash("success");
	next();
});

app.use(mainRoutes);
app.use(authRoutes);

app.listen(process.env.PORT || 3000, function(){
	console.log("The Server is Listening!!!")
});