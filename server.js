var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Task = require('./api/models/soundsModel'),
  bodyParser = require('body-parser'),
  busboyBodyParser = require('busboy-body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/soundsdb'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(busboyBodyParser());
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use('/styles', express.static(__dirname + '/node_modules/'));

var routes = require('./api/routes/soundsRoutes');
routes(app);

app.listen(port);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

console.log('todo list RESTful API server started on: ' + port);