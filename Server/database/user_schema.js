/**
 * module for definition of database schema
 * 
 * @date 2016-11-10
 * @author Mike
 */

var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose) {
	
	// definition of the user schema
	var UserSchema = mongoose.Schema({
		email: {type: String, 'default':''}
	    , hashed_password: {type: String, 'default':''}
	    , name: {type: String, index: 'hashed', 'default':''}
	    , salt: {type:String}
	    , created_at: {type: Date, index: {unique: false}, 'default': Date.now}
	    , updated_at: {type: Date, index: {unique: false}, 'default': Date.now} 
	    , provider: {type: String, 'default':''}
	    , authToken: {type: String, 'default':''}
	    , facebook: {}
	    , twitter: {}
	    , github: {}
	    , google: {}
		, linkedin: {}
		//Updated for the specification in Database file(google drive)
		, display_name: {type: String, 'default':''}
		, country: {type: String, 'default':''}
		, exp: {type: Number, 'default':0}
	});
	
	// password is setted as virtual method : This is convenient attribute which is not using MongoDB at all. Selecting specific element and defining set, get method
	UserSchema
	  .virtual('password')
	  .set(function(password) {
	    this._password = password;
	    this.salt = this.makeSalt();
	    this.hashed_password = this.encryptPassword(password);
	    console.log('virtual password is called : ' + this.hashed_password);
	  })
	  .get(function() { return this._password });
	
	// Adding method for using model instance to shecma.
	// Password encrypting method
	UserSchema.method('encryptPassword', function(plainText, inSalt) {
		if (inSalt) {
			return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
		} else {
			return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
		}
	});
	
	// making salt value for encrypt
	UserSchema.method('makeSalt', function() {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	});
	
	// Auth method - compares Password with input (returns true/false)
	UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
		if (inSalt) {
			console.log('authenticate is called : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
			return this.encryptPassword(plainText, inSalt) === hashed_password;
		} else {
			console.log('authenticate is called : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
			return this.encryptPassword(plainText) === this.hashed_password;
		}
	});
	

	UserSchema.method('checkValidation', function() {
	    return (this.provider == '');
	});
	
	// validation method
	var validatePresenceOf = function(value) {
		return value && value.length;
	};
		
	// Definition of trigger method when we save (Errors will be ocuured when password field is not valid)
	UserSchema.pre('save', function(next) {
		if (!this.isNew) return next();
	
		if (!validatePresenceOf(this.password) && this.checkValidation()) {
			next(new Error('This is not valid password field.'));
		} else {
			next();
		}
	})
	
	// checking every column has its values.
	UserSchema.path('email').validate(function (email) {
		if (!this.checkValidation()) return true;
		return email.length;
	}, 'Cannot find values in email column.');
	
	UserSchema.path('hashed_password').validate(function (hashed_password) {
		if (!this.checkValidation()) return true;
		return hashed_password.length;
	}, 'Cannot find values in hashed_password column.');
	
	   
	// adding static method to schema
	UserSchema.static('findByEmail', function(email, callback) {
		return this.find({email:email}, callback);
	});
	
	UserSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});
	
	UserSchema.static('load', function(options, callback) {
		options.select = options.select || 'name';
	    this.findOne(options.criteria)
	      .select(options.select)
	      .exec(callback);
	});
	
	
	// Schema registration for model
	mongoose.model('User', UserSchema);
	
	
	console.log('[user_schema.js] UserSchema is defined.');

	return UserSchema;
};

//  direct projection of UserSchema object to module.exports
module.exports = Schema;


