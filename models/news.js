const mongoose = require('mongoose'),
      dotenv   = require('dotenv');

dotenv.config();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

mongoose.set('useFindAndModify', false);

var newsSchema = new mongoose.Schema({
	title : String,
    author : String,
    source : String,
    description : String,
    source_news : String,
    image : String,
    publishedAt : Date,
    content : String
});

module.exports = mongoose.model("News", newsSchema);