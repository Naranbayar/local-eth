/**
 * config file of passport
 * 
 * Passport setting of authentication using twitter.
 *
 * @date 2016-11-10
 * @author Mike
 */
//not implemented yet
var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('../config');

module.exports = function(app, passport) {
	return new TwitterStrategy({
		consumerKey: config.twitter.clientID,
		consumerSecret: config.twitter.clientSecret,
		callbackURL: config.twitter.callbackURL
	}, function(accessToken, refreshToken, profile, done) {
		console.log('[twitter.js] twitter is called in passport.');
		console.dir(profile);
		
		var options = {
		    criteria: { 'twitter.id': profile.id }
		};
		
		var database = app.get('database');
	    database.UserModel.load(options, function (err, user) {
			if (err) return done(err);
      
			if (!user) {
				var user = new database.UserModel({
					name: profile.displayName,
			        provider: 'twitter',
			        twitter: profile._json
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
