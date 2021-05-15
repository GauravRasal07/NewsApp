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
	  moment     		 	= require("moment"),
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

let articles;
function getNewsHeadLines(country, category){
    var options = {
        method: 'GET',
        url: 'https://newsapi.org/v2/top-headlines',
        params: {
            country : country,
            category : category,
            apiKey : process.env.apiKey
            },
        };
        
        axios.request(options).then(function (response) {
            articles = response.data.articles;
        }).catch(function (error) {
            console.error(error);
        });
}

getNewsHeadLines('in', '')

app.use(function(req, res, next){
	res.locals.moment	   = moment;
	res.locals.currentUser = req.user;
    res.locals.articles    = req.articles;
	res.locals.error	   = req.flash("error");
	res.locals.success	   = req.flash("success");
	res.locals.warning	   = req.flash("warning");
	next();
});

app.use(mainRoutes);
app.use(authRoutes);

app.listen(process.env.PORT || 3000, function(){
	console.log("The Server is Listening!!!")
});