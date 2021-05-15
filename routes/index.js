const express    = require("express"),
      News       = require('../models/news'),
      User       = require('../models/user'),
	  middleware = require("../middleware"),
      dotenv     = require('dotenv'),
      axios      = require("axios").default,
      router     = express.Router({mergeParams : true});

dotenv.config();

var articles;

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

function getEverything(query){
    var options = {
        method: 'GET',
        url: 'https://newsapi.org/v2/everything',
        params: {
            q : query,
            apiKey : process.env.apiKey
            },
        };
        
        axios.request(options).then(function (response) {
            articles = response.data.articles;
        }).catch(function (error) {
            console.error(error);
            req.flash('error', 'Something went wrong, Try again later');
        });
}

getNewsHeadLines("in", "");

router.get('/', (req, res) => {
     res.redirect('/home');
});

router.get('/home', (req, res) => {
    res.render('home', { articles : articles });
});

router.post('/home', (req, res) => {
    if(req.body.q){
        getEverything(req.body.q);
         res.redirect('/home');
    } else {
        getNewsHeadLines(req.body.country, req.body.category);
        res.redirect('/home');
    }
});

router.get('/save-article', (req, res) => {
    req.flash("error", "Please LogIn First");
    res.redirect('/login');
});

router.post('/save-article/:Id', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.Id).populate('saved').exec((err, user) => {
        let temp = false;
        user.saved.forEach(news => {
            if(news.title == req.body.article.title){
                temp = true;
            } 
        })
        
        if(!temp){
            News.create(req.body.article, (err, savedNews) => {
                if(err){
                    console.log(err);
                } else {
                    user.saved.push(savedNews);
                    user.save();
                    req.flash('success', 'Article saved to your collection!');
                    res.redirect('/home');
                }
            })
        } else {
            req.flash('warning', 'The article is allready saved in your collection.');
            res.redirect('/home');
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