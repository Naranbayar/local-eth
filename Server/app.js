/**
 * making bulletin board
 * 
 * Basic implementation of basic bulletin board
 *
 * @date 2016-11-10
 * @author Mike
 */
 

// Express module imporing
var express = require('express')
  , http = require('http')
  , path = require('path');

// Importing one of middleware in Express
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

// using error handler module 
var expressErrorHandler = require('express-error-handler');

// Importing Session middleware
var expressSession = require('express-session');
  

//===== Using Passport =====//
var passport = require('passport');
var flash = require('connect-flash');


// calling configs which are separated by module.
var config = require('./config/config');

// calling database which are separated by module.
var database = require('./database/database');

// calling router which are separated by module.
var route_loader = require('./routes/route_loader');

 


// making express object
var app = express();


//===== setting view engine =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('[app.js] view engine is ejs.');


//===== setting server variables and folder by static.  =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);
 

// Parse application/x-www-form-urlencoded by using body-parser
app.use(bodyParser.urlencoded({ extended: false }))

// Parse application/json by using body-parser
app.use(bodyParser.json())

// Opens public folder using static
app.use('/public', static(path.join(__dirname, 'public')));
 
// setting cookie-parser 
app.use(cookieParser());

// setting session
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));



//===== Setting Passport =====//
// To use session in Passport, there must be code for using sessions in Express first
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
 


// Setting routing by reading route information
var router = express.Router();
route_loader.init(app, router);


// setting passport
var configPassport = require('./config/passport');
configPassport(app, passport);

// setting routing of passport
var userPassport = require('./routes/user_passport');
userPassport(router, passport);



//===== 404 error page handling =====//
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//===== Server start =====//

// handling of uncaught exceptions. [leave server process unterminated.]
process.on('uncaughtException', function (err) {
	console.log('uncaughtException occured : ' + err);
	console.log('[app.js] leave server process unterminated.');
	
	console.log(err.stack);
});

// Terminating database connection when process ends
process.on('SIGTERM', function () {
    console.log("[app.js] Process is terminated.");
    app.close();
});

app.on('close', function () {
	console.log("Express server object is terminated.");
	if (database.db) {
		database.db.close();
	}
});

// returns started server object 
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('[app.js] server is launched. port : ' + app.get('port'));

	// Initialization of database
	database.init(app, config);
   
});
