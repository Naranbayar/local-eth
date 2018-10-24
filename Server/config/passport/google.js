/**
 * config file of passport
 * 
 * Passport setting of authentication using google.
 *
 * @date 2016-11-10
 * @author Mike
 */
//not implemented yet
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('../config');

module.exports = function(app, passport) {
	return new GoogleStrategy({
    	clientID: config.google.clientID,
    	clientSecret: config.google.clientSecret,
    	callbackURL: config.google.callbackURL
	}, function(accessToken, refreshToken, profile, done) {
		console.log('[google.js] google is called in passport.');
		console.dir(profile);
		
		var options = {
		    criteria: { 'google.id': profile.id }
		};
		
		var database = app.get('database');
	    database.UserModel.load(options, function (err, user) {
			if (err) return done(err);
      
			if (!user) {
				var user = new database.UserModel({
					name: profile.displayName,
			        email: profile.emails[0].value,
			        provider: 'google',
			        google: profile._json
				});
        
				user.save(function (err) {
					if (err) console.log(err);
					return done(err, user);
				});
			} else {
				return done(err, user);
			}
	    });
	});
};
