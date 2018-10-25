/**
 * Passport setting file
 * This file is moduled for separate setting codes of passport from main code.
 * Setting serializeUser, deserializeUser methods
 *
 * @date 2016-11-10
 * @author Mike
 */

var local_login = require('./passport/local_login');
var local_signup = require('./passport/local_signup');
var facebook = require('./passport/facebook');
var twitter = require('./passport/twitter');
var google = require('./passport/google');

module.exports = function (app, passport) {
	console.log('[passport.js] config/passport called.');

    // This will be called after success of user authentication
    // making session of user information.
    // Requests commig after 'Sign in' can be checked in 'deserializeUser' method by the session
    passport.serializeUser(function(user, done) {
        console.log('[passport.js] serializeUser() is called.');
        console.dir(user);

        done(null, user);  // This user object is used for making session.
    });

    // This method is called every requests after user authentication.
    // After user auth, the session made by 'serializeUser' method is given by input parameter.
    passport.deserializeUser(function(user, done) {
        console.log('[passport.js] deserializeUser() is called.');
        console.dir(user);
        // If there's only id and email information in user information, We need user information List. Currently passport manages whole user object.
        // user information given by the second parameter is recovered as req.user object.
        // We are passing user as it is.
         done(null, user);  
    });

	// Setting the way of authentication
	passport.use('local-login', local_login);
	passport.use('local-signup', local_signup);
	passport.use('facebook', facebook(app, passport));
	passport.use('twitter', twitter(app, passport));
	passport.use('google', google(app, passport));
	console.log('[passport.js] 5 kinds of  passport protocol is set.');
	
};