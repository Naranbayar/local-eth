/**
 * Schema for Offer
 *
 * @date 2019-04-01
 * @author Alan
 */

var utils = require('../utils/utils');

var SchemaOffer = {};

SchemaOffer.createSchema = function (mongoose) {

    var OfferSchema = mongoose.Schema({
        //TODO : handle with user login
        //_user_id:        { type: mongoose.Schema.ObjectId, required: true, ref: 'User'},

        country: { type: String, required: true, enum: ['KOR', 'USA'], default: 'KOR' },
        //_city_id:        { type: mongoose.Schema.ObjectId, ref: 'City'},
        currency: { type: String, required: true, enum: ['WON', 'USD'], default: 'WON' },
        user: { type: String, required: true, },
        type: { type: String, required: true, enum: ['BUY', 'SELL'], default: 'SELL' },

        status: { type: String, required: true, enum: ['ACTIVE', 'PAUSE', 'DONE'], default: 'ACTIVE' },

        amount_min: { type: Number, required: true, default: 0.0 },
        amount_max: { type: Number, required: true, default: 1.0 },

        payment_type: { type: String, required: true, enum: ['BANK', 'CASH'], default: 'BANK' },

        price_method: { type: String, required: true, enum: ['CONSTANT', 'FLEXIBLE'], default: 'CONSTANT' },
        price_source: { type: String, required: true, default: 'NONE' },
        price: { type: Number, required: true, default: 1 },

        created_date: { type: Date, default: Date.now },
        updated_date: { type: Date, default: Date.now }
    });

    //TODO : add all validations
    OfferSchema.path('amount_min').required(true, 'Please insert min amount.');
    OfferSchema.path('amount_max').required(true, 'Please insert max amount.');

    OfferSchema.methods = {
        saveOffer: function (callback) {
            var self = this;

            this.validate(function (err) {
                if (err) return callback(err);

                self.save(callback);
            });
        },
    }

    OfferSchema.statics = {
        load: function (id, callback) {
            this.findOne({ _id: id })
                //.populate('_user_id', 'Created user')
                .populate('country')
                .populate('currency')
                .exec(callback);
        },
        list: function (options, callback) {
            //var criteria = options.criteria || {};
            this.find({}).exec(callback);
        }
    }

    // adding static method to schema
    OfferSchema.static('findByUser', function (id, callback) {
        return this.find({ user: id }, callback).exec(callback);
    });

    OfferSchema.static('findActives', function (name, callback) {
        return this.find({
            $and: [
                { status: 'ACTIVE' },
                { user: { "$ne": name } }
            ]
        }).exec(callback);
    });

    OfferSchema.static('findTrades', function (name, callback) {
        return this.find({
            $or: [{
                $and: [
                    { status: 'ACTIVE' },
                    {
                        user: { "$eq": name }
                    }]
            }, {
                $and: [
                    { status: 'DONE' },
                    {
                        user: { "$eq": name }
                    }]
            }]
        }).exec(callback);
    });

    console.log('[offer_schema.js] OfferSchema success.');

    return OfferSchema;
};

module.exports = SchemaOffer;

