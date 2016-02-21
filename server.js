var express = require('express');
var app = express();
var PORT = 3000;

//bodyParser
var bodyParser = require('bodyParser');
app.use(bodyParser.urlencoded({ extended: false}));

//database
var Sequelize = require('sequelize');
var connection = new Sequelize('', 'root');

//handlebars setup
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//routes
app.get('/', function(req, res) {
    res.render('index');
});




//database connection with sequelize
connection.sync().then(function() {
  app.listen(PORT, function() {
      console.log("Listening on:" + PORT)
  });
});
