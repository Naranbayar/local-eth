/**
 * config file of passport
 * 
 * Passport setting for sign up using 'Local' authentication.
 * 
 * @date 2016-11-10
 * @author Mike
 */

var LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true    //Using this option means first parameter of below callback function is req object.
	}, function(req, email, password, done) {
        // checking name parameter
        var paramName = req.body.name || req.query.name;
	 
		console.log('[local_signup.js] local-signup is called in passport : ' + email + ', ' + password + ', ' + paramName);
		
	    // If we want findOne method isn't blocked, change the way as asyncronous 
	    process.nextTick(function() {
	    	var database = req.app.get('database');
		    database.UserModel.findOne({ 'email' :  email }, function(err, user) {
		        // if error occurs
		        if (err) {
		            return done(err);
		        }
		        
		        // if there's already duplicated user information
		        if (user) {
		        	console.log('[local_signup.js] there is already same id in database.');
		            return done(null, false, req.flash('signupMessage', 'This ID is already taken by someone.'));  // false in second parameter means authentication failed
		        } else {
		        	//  make model instance object and save it.
		        	var user = new database.UserModel({'email':email, 'password':password, 'name':paramName});
		        	user.save(function(err) {
		        		if (err) {
		        			throw err;
		        		}
		        		
		        	    console.log("[local_signup.js] added user data.");
		        	    return done(null, user);  // user in second parameter means authentication succeed.
		        	});
		        }
		    });    
	    });

	});
