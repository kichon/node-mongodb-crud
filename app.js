
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose');

var app = module.exports = express.createServer();
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    seq: Number,
    name: String,
});
mongoose.model('User', UserSchema);

mongoose.connect('mongodb://localhost/mydb');

var User = mongoose.model('User');
*/

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res) {

    User.find({}, function(err, users) {

        res.render('index', {
            title: 'Index',
            users: users,
        });
    });
});

app.get('/create', function(req, res) {
    res.render('post', {
        title: 'Post',
    });
});

app.post('/create', function(req, res) {

    var query = User.findOne({}, ['seq']);

    query.sort('seq', -1);

    query.exec(function(err, data) {
        var user = new User();
        user.name = req.body.name;
        user.seq = data.seq + 1;

        user.save(function(err) {
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        });
    });
});

app.post('/delete', function(req, res) {
    console.log(req.body);
    if (! req.body.delete) {
        User.findOne({ '_id' : req.body.id }, function(err, data) {
            if (err) {
                console.log(err);
            }
    
            //console.log(data);
            res.render('delete', {
                title: 'Delete',
                data: data,
            });
        });
    } else {
        User.remove({ '_id' : req.body.id }, function(err, data) {
            if (err) {
                console.log(err);
            }

            res.redirect('/');
        });
    }
});

app.get('/update/:id', function(req, res) {
    User.findOne({ '_id' : req.params.id }, function(err, data) {
        if (err) {
            console.log(err);
        }

        res.render('update', {
            title: 'Update',
            data: data,
        });
    });
});

app.post('/update', function(req, res) {
    User.update({ '_id' : req.body.id }, { name : req.body.name }, function(err, num) {
        if (err) {
            console.log(err);
        }
        console.log(num);

        res.redirect('/');
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
