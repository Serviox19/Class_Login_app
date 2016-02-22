var express = require('express');
var path = require('path');
var app = express();
var PORT = 3000;
var exphbs = require('express-handlebars');
var mysql = require('mysql');
var session = require('express-session');
var bcrypt= require('bcryptjs');

//bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));

//database
var Sequelize = require('sequelize');
var connection = new Sequelize('account', 'root');

//handlebars setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use("/public", express.static(__dirname + '/public'));

//sequelize user object
var User = connection.define('user', {
  firstname: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [5,10],
        msg: "Your password must be between 5-10 characters"
      },
    }
  },
  student: {
    type: Sequelize.BOOLEAN
  },
  teacher: {
    type: Sequelize.BOOLEAN
  },
}, {
  hooks: {
    beforeCreate: function(input){
      input.password = bcrypt.hashSync(input.password, 10);
    }
  }
});

//add to Users table, this is part of my registering route
/*User.create({
  email: 'test2@email.com',
  student: false,
  teacher: false,
  password: 'test1234',
  firstname: 'Bruce',
  lastname: 'Banner',
}).then(function(task) {
  task.save();
});
*/

//debugging tool for querying table
/*User.findAll({
  where: {
    email: 'test2@email.com'
  }
}).then(function(foundObject) {
  foundObject.forEach(function(data) {
    console.log(data);
  })
});*/

app.use(session({
  secret: 'This is top secret stuff',
  resave: true,
  saveUninitialized: true,
  cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) }, // 4 hours
}));





//routes
app.get('/home', function(req, res) {
    res.render('home', {title: "Welcome to RCB"});
});

app.get('/login', function(req, res) {
    res.render('login', {title: "Login to your Account"});
});

app.post('/home', function(req, res){
  User.create(req.body).then(function(result){
    res.redirect('/login');
  }).catch(function(err) {
    console.log(err);
    res.redirect('/?msg=' + err.errors[0].message);
  });
});

//login to class using credentials from register page
app.post('/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({
    where: {
      email: email,
      password: password
    }
  }).then(function(user){
    if(user){
      req.session.authenticated = user;
      res.redirect('/dashboard');
    } else {
      res.redirect('/?msg=Invalid login');
    }
  }).catch(function(err){
    throw err;
  });
});

app.get('/dashboard', function(req,res) {

  // if user is authenticated
  if(req.session.authenticated){
    res.render("dashboard");
  } else {
    res.redirect("/?msg=you are not logged in");
  }
});





//database connection with sequelize
connection.sync().then(function() {
  app.listen(PORT, function() {
      console.log("Listening on:" + PORT)
  });
});
