/**
 * schema for countries
 *
 * @date 2018-10-11
 * @author Alan
 */

var utils = require('../utils/utils');

var SchemaObj = {};

SchemaObj.createSchema = function(mongoose) {
	
	// definition of country
	var CountrySchema = mongoose.Schema({
	    name: {type: String, trim: false, 'default':''},		// name of the country
	    abbrviation: {type: String, trim:true, 'default':''},   // name of the abbrviation
	});
	
	// 'required' validation
	CountrySchema.path('name').required(true, 'You need a name for a country');
	CountrySchema.path('abbrviation').required(true, 'You need an abbreviation.');
	
	// Adding instance method in schema
	CountrySchema.methods = {
		saveCountry: function(callback) {		// saving
			var self = this;
			console.log("logggggg");
			this.validate(function(err) {
				if (err) return callback(err);
				
				self.save(callback);
			});
		}
	}
	
	CountrySchema.statics = {
		// finding by abbreviation
		load: function(abbrviation, callback) {
			this.findOne({abbrviation: abbrviation})
				.exec(callback);
		},
		list: function(options, callback) {
			var criteria = options.criteria || {};
			
			this.find(criteria)
				.limit(Number(options.perPage))
				.skip(options.perPage * options.page)
				.exec(callback);
		}
	}
	
	console.log('Defined CountrySchema.');

	return CountrySchema;
};

// module.exports에 CountrySchema 객체 직접 할당
module.exports = SchemaObj;

