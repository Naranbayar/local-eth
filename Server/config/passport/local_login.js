/**
 * config file of passport
 * 
 *  Setting of "Local" authentication in passport.
 * @date 2016-11-10
 * @author Mike
 */

var LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true   //Using this option means first parameter of below callback function is req object.
	}, function(req, email, password, done) { 
		console.log('[local_login.js] local-login is called in passport : ' + email + ', ' + password);
		
		var database = req.app.get('database');
	    database.UserModel.findOne({ 'email' :  email }, function(err, user) {
	    	if (err) { return done(err); }

	    	// If there's no duplicated user information.
	    	if (!user) {
	    		console.log('[local_login.js] account didn\'t match.');
	    		return done(null, false, req.flash('loginMessage', 'there\'s wrong id and password information.'));  // false in second parameter means authentication failed
	    	}
	    	
	    	// Password is wrong
			var authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
			if (!authenticated) {
				console.log('[local_login.js] Password didn\'t match');
				return done(null, false, req.flash('loginMessage', 'there\'s wrong id and password information.'));  // false in second parameter means authentication failed
			} 
			
			// Normal
			console.log('[local_login.js] exact match of id and password occured.');
			return done(null, user);   // user in second parameter means authentication succeed.
	    });

	});

