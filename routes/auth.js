const express    = require("express"),
      router     = express.Router({mergeParams : true}),
      crypto     = require('crypto'),
      nodeMailer = require("nodemailer"),
	  dotenv     = require('dotenv'),
	  User       = require("../models/user"),
	  middleware = require("../middleware"),
	  passport   = require("passport");

dotenv.config();

//Register Routes

router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", (req, res) => {
	if(req.body.password === req.body.confirm){
		var newUser = new User({username : req.body.email});
		User.register(newUser, req.body.password, function(err, user){
			if(err){
				req.flash("error", err.message);
				res.redirect("/register");
			} else {
                req.flash("success", "Successfully Registered, Login with your Credentials!!!")
                res.redirect('/login');
            }
		})
	} else {
		req.flash("error", "Password Doesn't Matches!!!");
		res.redirect('back');
	}
	
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { 
    successRedirect : "/home",
	failureRedirect : "/login",
	failureFlash: true
}),(req, res) => {
});

//Login Routes
router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect : "/home",
	failureRedirect : "/login",
	failureFlash: true
}), (req, res) => {
});



//Logout Route
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

router.delete('/delete-user/:userId', (req, res) => {
	User.findByIdAndRemove(req.params.userId, function(err){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong!!!");
            res.redirect('back');
        } else {
                req.flash("success", "Your account is DELETED!!!");
                res.redirect('/');
        }
    })
});

router.get('/forgot-password', (req, res) => {
    res.render('forgot_pass');
});

router.post('/forgot-password', (req, res) => {
    User.findOne({ username : req.body.email }, (err, user) => {
        if(err || !user){
            req.flash("error", "No account registered with " + req.body.email);
            res.redirect('back');
        } else {
            crypto.randomBytes(20, (err, buff) => {
                var token = buff.toString('hex');

                user.resetPasswordToken   = token;
                user.resetPasswordExpires = Date.now() + 600000;
                user.save();

                var smtpTransport = nodeMailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'webdev.gr.77@gmail.com',
                        pass: process.env.GMAIL_PWD
                    }
                });
                var mailOptions = {
                    to: user.username,
                    from: 'The News App',
                    subject: 'PASSWORD RESET',
                    text: 'You are receiving this mail because you (or someone else) have requested the reset of the password for your account on The News App Website.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    + '\n\n\t\t\t\t\t\t\t\t\t\tRegards,\n\t\t\t\t\t\t\t\tThe News App'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    if(err){
                        console.log(err);
                        return  res.redirect('/login');
                    } else {
                        req.flash("success", "An e-mail has been sent to " + user.username + " with further instructions.");
                        res.redirect('back');
                    }
                })
            })
        }
    })
});

router.get('/reset/:token', (req, res) => {
	User.findOne({ resetPasswordToken : req.params.token, resetPasswordExpires : { $gt : Date.now() } }, (err, user) => {
		if(!user){
			req.flash('error', 'The Link has Expired or Invalid!!!');
			return  res.redirect('/forgot-password');
		}
		res.render('reset', { token : req.params.token, email : user.username });
	});
});

router.post('/reset/:token', (req, res) => {
    User.findOne({ resetPasswordToken : req.params.token, resetPasswordExpires : { $gt : Date.now() } }, (err, user) => {
        if(err || !user){
            req.flash("error", "The Link is invalid or has Expired!!!");
             res.redirect('back');
        } else {
            if(req.body.pass === req.body.confirm){
                user.setPassword(req.body.pass, function(err){
                    user.resetPasswordToken   = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save((err) => {
                        req.flash("success", "Password Changed Successfully!!!")
                        res.redirect('/login');
                    });
                })
            } else {
                req.flash("error", "Password DO NOT Match!!!");
                res.redirect('back');
            }
        }
    })
});


module.exports = router;