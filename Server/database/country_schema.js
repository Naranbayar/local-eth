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
	    name:            { type: String, trim: false, 'default':''},  // name of the country
	    abbreviation:    { type: String, trim: true, 'default':''},   // name of the abbreviation
	});
	
	// 'required' validation
	CountrySchema.path('name').required(true, 'You need a name for a country');
	CountrySchema.path('abbreviation').required(true, 'You need an abbreviation.');
	
	// Adding instance method in schema
	CountrySchema.methods = {
		saveCountry: function(callback) {		// saving
			var self = this;
			this.validate(function(err) {
				if (err) return callback(err);
				
				self.save(callback);
			});
		}
	}
	
	CountrySchema.statics = {
		// finding by abbreviation
		load: function(abbreviation, callback) {
			this.findOne({abbreviation: abbreviation})
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
	
	console.log('[country_schema.js] Defined CountrySchema.');

	return CountrySchema;
};

// module.exports에 CountrySchema 객체 직접 할당
module.exports = SchemaObj;

