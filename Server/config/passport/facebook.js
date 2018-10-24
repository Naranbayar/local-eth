/**
 *  config file of passport
 * 
 * Passport setting of authentication using facebook.
 *
 * @date 2016-11-10
 * @author Mike
 */

var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config');

module.exports = function(app, passport) {
	return new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL
	}, function(accessToken, refreshToken, profile, done) {
		console.log('[facebook.js] facebook is called in passport.');
		console.dir(profile);
		
		var options = {
		    criteria: { 'facebook.id': profile.id }
		};
		
		var database = app.get('database');
	    database.UserModel.load(options, function (err, user) {
			if (err) return done(err);
      
			if (!user) {
				var user = new database.UserModel({
					name: profile.displayName,
					email: profile.emails[0].value,
					provider: 'facebook',
					authToken: accessToken,
					facebook: profile._json
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
