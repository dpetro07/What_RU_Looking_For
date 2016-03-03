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

var session = require('express-session');

app.use(session({
 secret: 'magnusrex',
 cookie: { secure: false,
  maxAge: 1000 * 60 * 60 * 24 * 14
},
saveUninitialized: true,
resave: true
}));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/?msg=Not Authenticated");
  }
}

var bcrypt = require('bcryptjs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

var expressHandlebars = require('express-handlebars');
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


var passport = require('passport');
var passportLocal = require('passport-local');



app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user)
});

passport.use(new passportLocal.Strategy(
  function(username, password, done) {
      //Check password in DB
      User.findOne({
        where:{
          username: username
        }
      }).then(function(user){
        //check password against hash
        if(user){
          bcrypt.compare(password, user.dataValues.password, function(err, bcryptUser){
            if(bcryptUser){
              //if password is correcnt authenticate the user with cookie
              done(null, user);
            }else{
              done(null,false);
            }
          });
        }else {
          done(null, null);
        }
      });
    }));



var Place = sequelize.define('Place', {
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },
  company: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  telephone: {
    type: Sequelize.STRING,
    isNumeric: true
  },
  price: {
    type: Sequelize.STRING
  },
  stars: {
    type: Sequelize.STRING
  }
});

var Review = sequelize.define('Review', {
  message: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      len: {
        args: [1, 500]
      }
    }
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      len: {
        args: [1]
      }
    }
  }
});

var User = sequelize.define('User', {
 email: {
  type: Sequelize.STRING,
  validate: {
   len: {
    args: [5,30]
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


Review.belongsTo(User);
User.hasMany(Review);

Place.belongsTo(User);
User.hasMany(Place);



app.get('/', function(req, res){
  res.render('home');
});

app.post('/login',
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/register' })
  );


app.get('/addreview', isLoggedIn, function(req,res, next) {
  res.render('detail');
});

app.get('/places', function(req, res){
  Place.findAll().then(function(reviews){
    res.render('listing', {reviews});
  });
});

app.get('/place/bars', function(req, res){
  Place.findAll({
    where : {
      category: 'bars'
    }
  }).then(function(reviews){
    res.render('listing', {reviews});
  });
});

app.get('/place/food', function(req, res){
  Place.findAll({
    where : {
      category: 'food'
    }
  }).then(function(reviews){
    res.render('listing', {reviews});
  });
});

app.get('/place/entertainment', function(req, res){
  Place.findAll({
    where : {
      category: 'entertainment'
    }
  }).then(function(reviews){
    res.render('listing', {reviews});
  });
});

app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', function(req, res){
  User.create(req.body).then(function(user){
    res.redirect('/');
  }).catch(function(err){
    console.log(err);
    res.redirect('/?msg=' + err.message);
  });
});



app.post('/newreview', function(req, res, next){
  req.body.UserId = req.user.id;
  Review.create(req.body).then(function(review){
    res.redirect('/?msg=Review Saved');
  }).catch(function(err){
    console.log(err);
    res.redirect('/?msg=' + err.message);
  });
});

app.post('/newplace', function(req,res){
  req.body.UserId = req.user.id;
  Place.create(req.body).then(function(review){
    res.redirect('/?msg=Place Saved');
  }).catch(function(err){
    console.log(err);
    res.redirect('/?msg=' + err.message);
  });
});

app.get('/logout', function(req,res){
  req.session.authenticated = false;
  res.redirect('/');
});

sequelize.sync().then(function() {
 app.listen(PORT, function() {
  console.log("LISTENING on port %s", PORT);
});
});
