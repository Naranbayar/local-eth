/**
 * module for database schema for board page
 * @date 2016-11-10
 * @author Mike
 */

var utils = require('../utils/utils');

var SchemaObj = {};

SchemaObj.createSchema = function(mongoose) {
	
	// definition of single wtiring
	var PostSchema = mongoose.Schema({
	    title: {type: String, trim: true, 'default':''},
	    contents: {type: String, trim:true, 'default':''},
			writer: {type: mongoose.Schema.ObjectId, ref: 'User'},
	    comments: [{		// comments
			contents: {type: String, trim:true, 'default': ''},
			writer: {type: mongoose.Schema.ObjectId, ref: 'User'},
			created_at: {type: Date, 'default': Date.now}
	    }],
	    tags: {type: [], 'default': ''},
	    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
	    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
	});
	
	//  'required' validation
	PostSchema.path('title').required(true, 'Title is needed.');
	PostSchema.path('contents').required(true, 'Content is needed.');
	
	// adding instance method in schema
	PostSchema.methods = {
		savePost: function(callback) {		// saving the writing
			var self = this;
			
			this.validate(function(err) {
				if (err) return callback(err);
				
				self.save(callback);
			});
		},
		addComment: function(user, comment, callback) {		// adding comment
			this.comment.push({
				contents: comment.contents,
				writer: user._id
			});
			
			this.save(callback);
		},
		removeComment: function(id, callback) {		//  deleting comment
			var index = utils.indexOf(this.comments, {id: id});
			if (~index) {
				this.comments.splice(index, 1);
			} else {
				return callback('Cannot find comment of ID [' + id + '].');
			}
			
			this.save(callback);
		}
	}
	
	PostSchema.statics = {
		// finding writes by ID
		load: function(id, callback) {
			this.findOne({_id: id})
				.populate('writer', 'name provider email')
				.populate('comments.writer')
				.exec(callback);
		},
		list: function(options, callback) {
			var criteria = options.criteria || {};
			
			this.find(criteria)
				.populate('writer', 'name provider email')
				.sort({'created_at': -1})
				.limit(Number(options.perPage))
				.skip(options.perPage * options.page)
				.exec(callback);
		}
	}
	
	console.log('[post_schema.js] PostSchema is defined.');

	return PostSchema;
};

// PostSchema object projection to module.exports
module.exports = SchemaObj;

