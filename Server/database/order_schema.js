/**
 * Schema for ORDER
 *
 * @date 2018-10-11
 * @author Naranbayar
 */

var utils = require('../utils/utils');

var SchemaOrder = {};

SchemaOrder.createSchema = function(mongoose) {
	
	var OrderSchema = mongoose.Schema({
		//TODO : handle with user login
	    //_user_id:        { type: mongoose.Schema.ObjectId, required: true, ref: 'User'},

	    _country_id:     { type: mongoose.Schema.ObjectId, required: true, ref: 'Country'},
	    //_city_id:        { type: mongoose.Schema.ObjectId, ref: 'City'},
	    _currency_id:    { type: mongoose.Schema.ObjectId, required: true, ref: 'Currency'},

	    type:            { type: String, required: true, enum: ['BUY', 'SELL'], default: 'SELL'},

	    status:          { type: String, required: true, enum: ['ACTIVE', 'PAUSE', 'DONE'], default: 'ACTIVE'},
	    
	    amount_min:      { type: Number, required: true, default:0.0},
	    amount_max:      { type: Number, required: true, default:1.0},

	    payment_type:    { type: String, required: true, enum: ['BANK', 'CASH'], default: 'BANK'},

	    price_method:    { type: String, required: true, enum: ['CONSTANT', 'FLEXIBLE'], default: 'CONSTANT'},
	    price_source:    { type: String, required: true, default:'NONE'},
		price:           { type: Number, required: true, default:1},

	    created_date:    { type: Date, default: Date.now},
	    updated_date:    { type: Date, default: Date.now}
	});
	
	//TODO : add all validations
	OrderSchema.path('amount_min').required(true, 'Please insert min amount.');
	OrderSchema.path('amount_max').required(true, 'Please insert max amount.');
	
	OrderSchema.methods = {
		saveOrder: function(callback) {
			var self = this;
			
			this.validate(function(err) {
				if (err) return callback(err);
				
				self.save(callback);
			});
		},
	}
	
	OrderSchema.statics = {
		load: function(id, callback) {
			this.findOne({_id: id})
				//.populate('_user_id', 'Created user')
				.populate('_country_id')
				.populate('_currency_id')
				.exec(callback);
		},
		list: function(options, callback) {
			var criteria = options.criteria || {};
			
			this.find(criteria)
				//.populate('_user_id', 'Created user')
				.populate('_country_id')
				.populate('_currency_id')
				.limit(Number(options.perPage))
				.skip(options.perPage * options.page)
				.exec(callback);
		}
	}
	
	console.log('OrderSchema success.');

	return OrderSchema;
};

module.exports = SchemaOrder;

