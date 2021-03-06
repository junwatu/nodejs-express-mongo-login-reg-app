/*
 * Simple Login Registration Node.js App
 * This app use Express 3, Mongoose 3, Underscore and MongoDB database
 *
 *
 * Author By Equan Pr.
 * http://www.junwatu.com
 *
 * License :  Whatever you want! :D
 */

var express = require("express"),
    engines = require('consolidate'),
    app = express(),
    mongoose = require('mongoose'),
    dbmessage = '',
    apptitle = 'NodeApp',
    MemoryStore = require('connect').session.MemoryStore,

/*
 * UserSchema
 *
 */
UserSchema = new mongoose.Schema({
    username:'string',
    password:'string',
    email:'string'
});

app.configure(function () {
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(express.cookieParser());
    app.use(express.session(
        {secret:"secret key", store:new MemoryStore()}));
    app.use(express.static(__dirname + '/app'));

    app.engine('html', engines.underscore);

    /*
     Set views directory. DO NOT set this with the same static directory!.
     */
    app.set('views', __dirname + '/app/views');
    app.set('view engine', 'html');
    app.set('PORT', 3000);

    // MongoDB for development
    app.set('MONGODB_DEV', 'mongodb://localhost/contacts');

    /**
     * MongoDB for production
     *
     * HardCode for demo purpose only
     */
    app.set('MONGODB_PROD', 'mongodb://usernam:password@domainmu.com:212/contacts');

    /**
     * NODE_ENV=development
     */
    if ('development' == app.get('env')) {
        app.set('MONGODB_CONN', app.get('MONGODB_DEV'));
    }

    /**
     * NODE_ENV=production
     */
    if ('production' == app.get('env')) {
        app.set('MONGODB_CONN', app.get('MONGODB_PROD'));
    }

});

/* ==================================
 * MongoDB connection using Mongoose
 */

var db = mongoose.createConnection(app.get('MONGODB_CONN')),
    User = db.model('users', UserSchema);

db.on('connected', function () {
    console.log('Aplikasi terhubung dengan database MongoDB.');
    dbmessage = 'Aplikasi terhubung dengan database MongoDB.';
});

db.on('error', function () {
    console.error.bind(console, 'Connection error!');
    dbmessage = 'Koneksi ke MongoDB error!';
});

app.get("/", function (req, res) {
    res.render('index', {
        title:apptitle,
        message:''
    });
});

// REGISTRATION
app.get('/user/registration', function (req, res) {
    res.render("user/registration", {title:apptitle});
});

// AUTHENTICATION
app.post('/user/login', function (req, res) {

    User.find({username:req.body.username, password:req.body.password}, function (err, user) {

        if (user.length > 0) {
            console.log('User Data:\n');
            console.log(user);

            req.session.loggedIn = true;

            res.render('user/home', {
                user:user[0],
                title:apptitle
            });
        } else {
            console.log('ERROR: Wrong Username or Password');
            res.render('index', {
                title:apptitle,
                message:'<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button><h4>Error!</h4>Wrong username or password</div>'
            });
        }
    });
});

app.param('name', function (req, res, next, name) {
    User.find({username:name}, function (err, user) {
        req.user = user[0];
        console.log(user);
        next();
    });
})

app.get("/user/:name", function (req, res) {
    if (req.session.loggedIn) {
        res.render('user/home', {
            user:req.user,
            title: apptitle
        });
    } else {
        res.render('index', {
            title:apptitle,
            message:''
        });
    }
})

// CREATE USER
app.post("/user/create", function (req, res) {

    var user = new User({
        username:req.body.username,
        password:req.body.password,
        email:req.body.email
    });

    user.save(function (err, user) {
        if (err) res.json(err)
        //res.end('Registration '+user.username +' Ok!');
        req.session.loggedIn = true;
        res.redirect('/user/' + user.username);
    });
});


// LOGOUT
app.get('/logout', function (req, res) {
    // clear user session
    req.session.loggedIn = false;
    res.render('index',{
        title:apptitle,
        message:''});
});

app.listen(app.get('PORT'));
console.log('Node-Express-MongoDB Login Registration App');
console.log('-------------------------------------------');
console.log("Server Port: " + app.get('PORT'));
