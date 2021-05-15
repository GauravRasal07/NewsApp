const mongoose	  = require('mongoose'),
      axios       = require("axios").default,
      News        = require('../models/news');

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

News.remove({}, (err, deleted) => {
    if(err){
        console.log(err);
    } else {
        console.log("Cleared News Feed");
    }
})

// var options = {
//     method: 'GET',
//     url: 'https://api.jsonbin.io/b/607ee47cf099765deef85e5d',
// };

// axios.request(options).then(function (response) {
//     let articles = response.data.articles;
//     articles.sort(function(a, b){
//         return new Date(a.publishedAt) - new Date(b.publishedAt);
//     });
//     articles.forEach(article => {
//         let news = {
//             title : article.title,
//             description : article.description,
//             content : article.content,
//             image : article.urlToImage,
//             source : article.source.name,
//             author : article.author,
//             publishedAt : article.publishedAt,
//             source_news : article.url
//         }
//     News.create(news, (err, createdNews) => {
//         if(err){
//             console.log(err);
//         }
//     })
//     });
// }).catch(function (error) {
//     console.error(error);
// });


// Api Key : a1b7687c45614adc8ee23afa27f3e209