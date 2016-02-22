var express = require('express');
var path = require('path');
var app = express();
var PORT = 3000;
var exphbs = require('express-handlebars');
var mysql = require('mysql');

//bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));

//database
var Sequelize = require('sequelize');
var connection = new Sequelize('', 'root');

//handlebars setup
app.set('views', path.join(_dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use("/public", express.static(_dirname + '/public'));

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
      isUppercase: true
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


//routes
app.get('/', function(req, res) {
    res.render('home', {msg: req.query.msg});
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/', function(req, res){

});





//database connection with sequelize
connection.sync().then(function() {
  app.listen(PORT, function() {
      console.log("Listening on:" + PORT)
  });
});
