var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;

require('dotenv').config();

var Sequelize = require('sequelize');
var mysql = require('mysql');

if(process.env.NODE_ENV === 'production') {
  // HEROKU DB
  console.log(process.env.JAWSDB_URL);
  var sequelize = new Sequelize(process.env.JAWSDB_URL);
} 
else {
  // LOCAL DB
  var sequelize = new Sequelize('ruflyer_db', 'root');
}


app.use("/js", express.static('models/js'));
app.use("/css", express.static('models/css'));
app.use("/images", express.static('models/images'));


app.use(require('express-session')({
 secret: 'magnusrex',
 cookie: { secure: false,
  maxAge: 1000 * 60 * 60 * 24 * 14
 },
 saveUninitialized: true,
 resave: true
}));

var session = require('express-session');
var bcrypt = require('bcryptjs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

var expressHandlebars = require('express-handlebars');
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var Review = sequelize.define('Review', {
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.INTEGER
  },
  stars: {
    type: Sequelize.INTEGER
  },
  description: {
    type: Sequelize.TEXT
  }
});

var User = sequelize.define('User', {
 email: {
  type: Sequelize.STRING,
  validate: {
   len: {
    args: [5,30],
   },
   isEmail: true
  },
  unique: true,
  allowNull: false
 },
 password: {
  type: Sequelize.STRING,
  validate: {
   len: {
    args: [5,12],
    msg: "Your password must contain 5-12 characters"
   }
  },
   allowNull: false
 },
 username: {
  type: Sequelize.STRING,
  validate: {
   len: {
    args: [1,30],
    msg: "You must have a user name"
   }
  },
  allowNull: false
 }, 
 firstname: {
  type: Sequelize.STRING,
  validate: {
   len: {
    args: [1,30],
    msg: "You must have a first name"
   }
  },
  allowNull: false
}, 
lastname: {
  type: Sequelize.STRING,
  validate: {
   len: {
    args: [1,30],
    msg: "You must have a last name"
   }
  },
  allowNull: false
 }
}, {
 hooks: {
  beforeCreate: function(input){
   input.password = bcrypt.hashSync(input.password, 10);
  }
 }
});


app.get('/', function(req, res){
  res.render('home');
});

app.get('/addreview', function(req, res){
  res.render('detail');
});

app.get('/showreviews', function(req, res){
  res.render('listing');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/register', function(req, res){
  res.render('login');
});

app.post('/register', function(req, res){
  User.create(req.body).then(function(user){
    res.redirect('home');
  }).catch(function(err){
    console.log(err);
    res.redirect('/?msg=' + err.message);
  });
});

app.post('/newreview', function(req, res){
  Review.create(req.body).then(function(user){
    res.redirect('home');
  }).catch(function(err){
    console.log(err);
    res.redirect('/?msg=' + err.message);
  });
});

sequelize.sync().then(function() {
 app.listen(PORT, function() {
  console.log("LISTENING on port %s", PORT);
 });
});
