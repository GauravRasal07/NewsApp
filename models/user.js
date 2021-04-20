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

passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username : {type : String, unique : true, required : true},
	password : String,
	resetPasswordToken : String,
	resetPasswordExpires : Date,
	saved : [
		{
			type : mongoose.Schema.Types.ObjectId,
        	ref : "News"
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);