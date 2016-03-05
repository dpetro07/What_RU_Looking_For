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
  imgUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  telephone: {
    type: Sequelize.STRING,
    isNumeric: true
  },
  price: {
    type: Sequelize.INTEGER,
    isInt: true,
    validate: {
      isIn: [['1', '2', '3', '4', '5']],
      len: {
        args: [1]
      }
    }
  },
  stars: {
    type: Sequelize.INTEGER,
    isInt: true,
    allowNull: false,
    validate: {
      isIn: [['1', '2', '3', '4', '5']],
      len: {
        args: [1]
      }
    }
  },
  desription: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      len: {
        args: [1,500]
      }
    }
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
    isInt: true,
    validate: {
      isIn: [['1', '2', '3', '4', '5']],
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
  unique: true,
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


User.hasMany(Review);
Review.belongsTo(User);

User.hasMany(Place);
Place.belongsTo(User);

Place.hasMany(Review);
Review.belongsTo(Place);





app.get('/', function(req, res){
    res.render('home', {Authenticated : req.isAuthenticated()});
    console.log(req.user);
});

app.post('/login',
  passport.authenticate('local', { 
    successRedirect: '/?msg=Logged In',
    failureRedirect: '/register?msg=Account not found' })
  );


app.get('/addplace', isLoggedIn, function(req,res, next) {
  res.render('detail');
  console.log(req.user);
});

app.get('/place', function(req, res){
  Place.findAll().then(function(reviews){
    res.render('listing', {reviews});
  });
});

app.get('/place/nightlife', function(req, res){
  Place.findAll({
    where : {
      category: 'nightlife'
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

app.get('/place/classroom-buildings', function(req, res){
  Place.findAll({
    where : {category: 'classroom-buildings'}
  }).then(function(reviews){
    res.render('listing', {reviews});
  });
});

app.get('/place/tourism', function(req, res){
  Place.findAll({
    where : {category: 'tourism'}
  }).then(function(reviews){
    res.render('listing', {reviews});
  });
});

app.get('/place/:category/:id', function(req, res){
  var id = req.params.id;
  Place.findAll({
    where : {id : id},
    include : [{
      model : Review,
       include : [{
        model: User
      }]
    }]
  }).then(function(places){
    res.render('singular', {places});
  });
});

app.get("/deleteplace/:id", function(req, res) {
  var id = req.params.id;
  Place.destroy({
      where: {id: id},
      include : [{
        model: User
      }]
    }).then(function(place) {
    res.redirect('/?msg=Review deleted');
    }).catch(function(err) {
      console.log(err);
      res.redirect('/?msg=' + err.message);
    });
});

app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', function(req, res){
  User.create(req.body).then(function(user){
    res.redirect('/?msg=Account Created, Please Login');
  }).catch(function(err){
    console.log(err);
    res.redirect('/?msg=' + err.message);
  });
});



app.post('/newreview/:id', function(req, res){
  req.body.UserId = req.user.id;
  req.body.PlaceId = req.params.id;

  Review.create(req.body).then(function(review){
    res.redirect('/?msg=Review Saved');
  }).catch(function(err){
    console.log(err);
    res.redirect('/?msg=' + err.message);
  });
});

app.post('/addplace', function(req,res){
  req.body.UserId = req.user.id;
  Place.create(req.body).then(function(review){
    res.redirect('/?msg=Place Saved');
  }).catch(function(err){
    console.log(err);
    res.redirect('/?msg=' + err.message);
  });
});

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

sequelize.sync().then(function() {
 app.listen(PORT, function() {
  console.log("LISTENING on port %s", PORT);
});
});
