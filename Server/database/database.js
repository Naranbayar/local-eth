
/*
 * Loading Database schema
 * This is basic code and developer don't have to change this codes
 *
 * @date 2016-11-10
 * @author Mike
 */

var mongoose = require('mongoose');
var fs = require('fs');

// Adding all of db, schema, model to database object
var database = {};

// This method is called for initialization.
database.init = function(app, config) {
	console.log('init() is called.');
	
	connect(app, config);
}

// Making connection with database and adding db object for attribute of request object
function connect(app, config) {
	console.log('connect() is called.');
	
	// connection with database object : using settings of config
    mongoose.Promise = global.Promise;  // Promise object of mongoose will use Promise object of global.

    if(1) {
		mongoose.connect(config.db_url);
	} else {
		mongoose.connect(config.db_url, function () { // in case of clear all database
		    mongoose.connection.db.dropDatabase();
		});
	}

	database.db = mongoose.connection;
	
	database.db.on('error', console.error.bind(console, 'mongoose connection error.'));	
	database.db.on('open', function () {
		console.log('[database.js] connection with database success. : ' + config.db_url);
		
		//making model object and schema object registered in config
		createSchema(app, config);
		
	});
	database.db.on('disconnected', connect);

}

// Making schema and model object defined in config file
function createSchema(app, config) {
	var schemaLen = config.db_schemas.length;
	console.log('the number of schemas in settings : %d', schemaLen);
	
	for (var i = 0; i < schemaLen; i++) {
		var curItem = config.db_schemas[i];
		
		// after importing module from module file, calling createSchema().
		var curSchema = require(curItem.file).createSchema(mongoose);
		console.log('schema is defined after importing %s module.', curItem.file);
		
		// User model definition.
		var curModel = mongoose.model(curItem.collection, curSchema);
		console.log('model is defined for %s collection.', curItem.collection);
		
		// Adding to attributes of the database object.
		database[curItem.schemaName] = curSchema;
		database[curItem.modelName] = curModel;
		if(curItem.modelName == 'CountryModel') {
			//make default country data
			fs.readFile('database/resources/' + curItem.defaultFile, 'utf-8', function(error, data) {
				var lines = data.split('\n');
				for(var ind = 0; ind < lines.length; ind++) {
					var item = lines[ind].split(',');

					var country = new database.CountryModel({
						name: item[1],
						abbreviation: item[0]
					});

					country.saveCountry(function(err, result) {
						console.log("Added country => " + result);
					});
				}
			});
		} 
		
		if(curItem.modelName == 'CurrencyModel') {
			//make default currency data
			fs.readFile('database/resources/' + curItem.defaultFile, 'utf-8', function(error, data) {
				var lines = data.split('\n');

				for(var ind = 0; ind < lines.length; ind++) {
					var item = lines[ind].split(',');

					var currency = new database.CurrencyModel({
						name: item[0],
						abbreviation: item[1],
						symbol: item[2]
					});

					currency.saveCurrency(function(err, result) {
						console.log("Added currency => " + result);
					});
				}
			});
		}
		console.log('schema name [%s], model name [%s] is added as attributes of database object.', curItem.schemaName, curItem.modelName);
	}
	
	app.set('database', database);
	console.log('database object is added as attributes of the app object.');
}
 

// database object projection to module.exports
module.exports = database;
