const passport       = require('passport'),
      GoogleStrategy = require('passport-google-oauth20').Strategy,
	    User           = require("./models/user");

passport.use(new GoogleStrategy({
    clientID: '917632693332-g5sv7h0eas1ol8c5u24h5v31g4m4v0bj.apps.googleusercontent.com',
    clientSecret: 'iO6dfScHHIwlEQHrrbmlfUSH',
    callbackURL: "http://localhost:3000/auth/google/callback"
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