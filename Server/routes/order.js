/**
 * ORDER
 *
 * @date 2018-10-11
 * @author Naranbayar
 */

// html-entities module is required in showOrder.ejs
var Entities = require('html-entities').AllHtmlEntities;

var addOrder = function(req, res) {
    console.log('body : ' + JSON.stringify(req.body));
    console.log('query : ' + JSON.stringify(req.query));

	var orderType = req.body.orderType || req.query.orderType;
	var amountMin = req.body.amountMin || req.query.amountMin;
	var amountMax = req.body.amountMax || req.query.amountMax;
	var price     = req.body.price     || req.query.price;
	var country   = req.body.country   || req.query.country;
	var currency  = req.body.currency  || req.query.currency;
    
	var database = req.app.get('database');
	
	if (database.db) {
		
		async.parallel({
	        currencyObj: function(callback) {
				database.CurrencyModel.load(currency, callback);
			},

			countryObj: function(callback) {
				database.CountryModel.load(country, callback);
			},

	    }, function(err, results) {
	        if (err) {
	        	res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>' + err + '</h2>');
				res.end();
	        }
	        if (results.currencyObj == null || results.countryObj == null) {
	        	res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>' + 'No result' + '</h2>');
				res.end();
	        }


        	var orderObj = new database.OrderModel({
				_country_id: results.countryObj._id,
				_currency_id: results.currencyObj._id,
				type: orderType, 
				amount_min: amountMin,
				amount_max: amountMax,
				price: price
			});

	        console.log(orderObj);

	        orderObj.saveOrder(function(err, result) {
				if (err) {
                    if (err) {
                        console.error('[order.js] An error occured making response web document. : ' + err.stack);

                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>An error occured making response web document.</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }
                }
			});

			return res.redirect('/process/listOrder/'); 
	    });		
		
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>Database connection failed</h2>');
		res.end();
	}	
};

var listOrder = function(req, res) {
	console.log('[order.js] listOrder is called in order module .');
  
    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;
	
    console.log('listOrder params : ' + paramPage + ', ' + paramPerPage);
    
	var database = req.app.get('database');
	
    // The case when database object is initialized
	if (database.db) {
		// 1. List of objects
		var options = {
			page: paramPage,
			perPage: paramPerPage
		}
		
		database.OrderModel.list(options, function(err, results) {
			if (err) {
                console.error('something wrong on OrderModel.list : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>An error occured in the list of board.</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
			if (results) {
				console.dir(results);
 
				// Checking the number of objects in whole document
				database.OrderModel.count().exec(function(err, count) {

					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					
					var context = {
						title: 'Ress',
						orders: results,
						page: parseInt(paramPage),
						pageCount: Math.ceil(count / paramPerPage),
						perPage: paramPerPage, 
						totalRecords: count,
						size: paramPerPage
					};
					console.log(context);
					req.app.render('listOrder', context, function(err, html) {
                        if (err) {
                            console.error('An error occured making response web document. : ' + err.stack);

                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            res.write('<h2>An error occured making response web document.</h2>');
                            res.write('<p>' + err.stack + '</p>');
                            res.end();

                            return;
                        }
                        
						res.end(html);
					});
					
				});
				
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>Making List of objects failed</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>Database connection failed</h2>');
		res.end();
	}
	
};

var async = require('async');

var newOrder = function(req, res) {

	var database = req.app.get('database');

	if (database.db) {

	    async.parallel({
	        currencies: function(callback) {
				database.CurrencyModel.list({}, callback);
			},

			countries: function(callback) {
				database.CountryModel.list({}, callback);
			},

	    }, function(err, results) {
	        if (err) {
	        	res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>' + err + '</h2>');
				res.end();
	        }
	        if (results.currencies == null || results.countries == null) {
	        	res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>' + 'No result' + '</h2>');
				res.end();
	        }
	        res.render('newOrder', { title: 'New Order page', countries: results.countries, currencies: results.currencies } );

	        /*req.app.render('newOrder', results, function(err, html) {
	        	console.log('Here : ' + results);
                if (err) {
                    console.error('An error occured making response web document. : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>An error occured making response web document.</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();

                    return;
                }
                
				res.end(html);
			});*/
	    });
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>' + 'Database not found' + '</h2>');
		res.end();
	}
};


//NOT FINISHED !!!
var showOrder = function(req, res) {
	console.log('showpost is called in post module.');
  
    // It's passed to URL parameter
    var paramId = req.body.id || req.query.id || req.params.id;
	
    console.log('Requested parameter : ' + paramId);
    
    
	var database = req.app.get('database');
	
    // The case when database object is initialized
	if (database.db) {
		// 1. List of objects
		database.OrderModel.load(paramId, function(err, results) {
			if (err) {
                console.error('There\'s an error in course of making list of object : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>There\'s an error in course of making list of object</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
			if (results) {
				console.dir(results);
  
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				
				// Send after rendering using view template
				/*var context = {
					title: 'List of writings ',
					posts: results,
					Entities: Entities
				};
				
				req.app.render('showOrder', context, function(err, html) {
					if (err) {
                        console.error('An error occured making response web document. : ' + err.stack);
                
                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>An error occured making response web document.</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }
					
					console.log('Response document : ' + html);
					res.end(html);
				});*/
			 
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>List up of objects failed</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>Database connection failed</h2>');
		res.end();
	}
	
};

module.exports.listOrder = listOrder;
module.exports.addOrder = addOrder;
module.exports.newOrder = newOrder;
module.exports.showOrder = showOrder;
