var express = require('express');
var path = require('path');
var app = express();
var PORT = 3000;
var exphbs = require('express-handlebars');

//bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));

//database
var Sequelize = require('sequelize');
var connection = new Sequelize('', 'root');

//handlebars setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + 'public'));


//routes
app.get('/', function(req, res) {
    res.render('home', {msg: req.query.msg});
});

app.get('/login', function(req, res) {
    res.render('login');
});






//database connection with sequelize
connection.sync().then(function() {
  app.listen(PORT, function() {
      console.log("Listening on:" + PORT)
  });
});
