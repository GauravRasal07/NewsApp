const passport       = require('passport'),
      GoogleStrategy = require('passport-google-oauth20').Strategy,
	    User           = require("./models/user");

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "https://the-news-app-gr.herokuapp.com/auth/google/callback"
  },
  (accessToken, refreshToken, profile, email, done) => {
    User.findOne({username : email.emails[0].value}, (err, user) => {
      if(err){
        req.flash("error", "Something went wrong!!!");
        res.redirect('/login');
      } else if (!user) {
        User.create({ username: email.emails[0].value }, (err, user) => {
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    })
    
  }
));