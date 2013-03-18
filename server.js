var express = require('express');
var app = express();

//data
var ToDoDataProvider = require('./dataController').ToDoDataProvider;

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

//init dataprovider
var todoProvider = new ToDoDataProvider('localhost', 27017);

//routes

////ROUTE WITH EXPRESS
app.get('/', function(req, res) {
    res.redirect('home');
});

app.get('/home', function(req, res) {
    todoProvider.findAll(function(error, items) {
        console.log('Error: ' + error);
        console.log(JSON.stringify(items));
        var sanitizedData = JSON.parse(JSON.stringify(items)); //convert db results to json and back to a js object
        var testData = [
            {desc: 'test item 1'},
            {desc: 'test item 2'}
        ];
        res.locals = {
            some_value: 'foo bar',
            todoItems: items,
            dbError: error,
            testValue1: 'hello'
        };

        res.render('home', {
            title: 'Home'
        });
    });
});

app.get('/test', function(req, res) {
    res.send('App is running.');
});

/****************
 * API
 ****************/
app.get('/api/todo', function(req, res) {
    todoProvider.findAll(function(error, items) {
       var resp = '{"status":"0"}';
       if(error) {
           resp = '{"status":"500","error":'+JSON.stringify(error)+'}';
       } else {
           resp = '{"status":"200","error":'+JSON.stringify(items)+'}';
       }
       res.send(resp);
    });
});

app.get('/api/todo/new', function(req, res) {
    todoProvider.save({
        desc: req.param('txt')
    }, function(error, items) {
        var resp = '{"status":"0"}';
        if(error) {
            resp = '{"status":"500","error":'+JSON.stringify(error)+'}';
        } else {
            resp = '{"status":"200"}';
        }
        res.send(resp);
    });
});

app.get('/api/todo/complete', function(req, res) {
    var objRef = req.param('ref');
    todoProvider.markComplete(objRef, function(error, items) {
        var resp = '{"status":"0"}';
        if(error) {
            resp = '{"status":"500","error":'+JSON.stringify(error)+'}';
        } else {
            resp = '{"status":"200"}';
        }
        res.send(resp);
    });
});




//listen for requests
app.listen(3000);
console.log('Listening on port 3000');