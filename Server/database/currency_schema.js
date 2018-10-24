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
	    name:            { type: String, trim: false, 'default':''},  // name of the currency
	    abbreviation:    { type: String, trim: true, 'default':''},   // name of the abbreviation
	    symbol:          { type: String, trim: true, 'default':''},   // name of the abbreviation
	});
	
	// 'required' validation
	CurrencySchema.path('name').required(true, 'You need a name for a currency');
	CurrencySchema.path('abbreviation').required(true, 'You need an abbreviation.');
	CurrencySchema.path('symbol').required(true, 'You need a symbol.');
	
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
	
	console.log('[currency_schema.js] Defined CurrencySchema.');

	return CurrencySchema;
};

// module.exports에 CurrencySchema 객체 직접 할당
module.exports = SchemaObj;

