var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;


var Sequelize = require('sequelize');
var sequelize = new Sequelize('process.env.JAWSDB_URL');

app.use("/js") = require('./models/js');
app.use("/css") = require('./models/css');

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

sequelize.sync().then(function() {
 app.listen(PORT, function() {
  console.log("LISTENING!");
 });
});
