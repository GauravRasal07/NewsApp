const express    = require("express"),
      News       = require('../models/news'),
      User       = require('../models/user'),
	  middleware = require("../middleware"),
      router     = express.Router({mergeParams : true});

router.get('/', (req, res) => {
     res.redirect('/home');
});

router.get('/home', (req, res) => {
    News.find({}, (err, articles) => {
        if(err){
            req.flash("error", "Something went Wrong!!!");
            res.redirect('/');
        } else {
            res.render('home', { articles : articles });
        }
    })
});

router.get('/save-article', (req, res) => {
    req.flash("error", "Please LogIn First");
    res.redirect('/login');
});

router.get('/save-article/:Id/:newsId', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.Id).populate('saved').exec((err, user) => {
        if(err){
             res.redirect('/home');
        } else {
            let temp = false;
            user.saved.forEach(article => {
                if(article.id == req.params.newsId){
                    temp = true;
                }
            });
            if(temp){
                req.flash("error", "The Article is allready saved!!!");
                res.redirect('/home');
            } else {
                user.saved.push(req.params.newsId);
                user.save();
                res.redirect('/home');
            }
        }
    })
});

router.get('/remove-article/:Id/:newsId', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.Id).populate('saved').exec((err, user) => {
        if(err){
             res.redirect('/home');
        } else {
            user.saved.forEach(article => {
                if(article.id == req.params.newsId){
                    let index = user.saved.indexOf(article);
                    user.saved.splice(index, 1);
                    user.save();
                }
            });
            req.flash("success", "Removed from saved");
            res.redirect('back');
        }
    })
});

router.get('/saved/:userId', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.userId).populate('saved').exec((err, user) =>{
        if(err){
            console.log(err);
             res.redirect('/');
        } else {
            res.render('saved', { user : user });
        }
    })
})


module.exports = router;