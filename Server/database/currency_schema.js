/**
 * schema for currencies
 *
 * @date 2018-10-11
 * @author Alan
 */

var utils = require('../utils/utils');

var SchemaObj = {};

SchemaObj.createSchema = function(mongoose) {
	
	// definition of currency
	var CurrencySchema = mongoose.Schema({
	    name: {type: String, trim: false, 'default':''},		// name of the currency
	    abbrviation: {type: String, trim:true, 'default':''},   // name of the abbrviation
	});
	
	// 'required' validation
	CurrencySchema.path('name').required(true, 'You need a name for a currency');
	CurrencySchema.path('abbrviation').required(true, 'You need an abbreviation.');
	
	// Adding instance method in schema
	CurrencySchema.methods = {
		saveCurrency: function(callback) {		// saving
			var self = this;
			
			this.validate(function(err) {
				if (err) return callback(err);
				
				self.save(callback);
			});
		}
	}
	
	CurrencySchema.statics = {
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
	
	console.log('Defined CurrencySchema.');

	return CurrencySchema;
};

// module.exports에 CurrencySchema 객체 직접 할당
module.exports = SchemaObj;

