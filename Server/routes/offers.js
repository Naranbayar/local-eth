var listOffers = function (req, res) {
    console.log('listOffers is called in post module.');
    // offers page
    console.log('[offers.js] /offers path is requested.');

    // If we have auth of this user, req.user has user informations. unless, req.user is false.
    console.log('[offers.js] value of req.user object.');
    console.dir(req.user);
    var database = req.app.get('database');
    var offers = undefined;
    // The case when database object is initialized
	if (database.db) {
		database.OfferModel.findByUser(req.user.name, function(err, results) {
            if (Array.isArray(req.user)) {
                res.render('offers.ejs', { user: req.user[0]._doc, login_success: true, offer:offers});
            } else {
                res.render('offers.ejs', { user: req.user, login_success: true, offer:offers });
            }
        });
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>Database connection failed</h2>');
		res.end();
	}
    // Not authenticated cases
    if (!req.user) {
        console.log('[offers.js] We need user auth.');
        res.redirect('/');
    } else {
        console.log('[offers.js] We have user auth.');
        console.log('[offers.js] /offers path is requested.');
        console.dir(req.user);

    }
}

var addOffersPage = function (req, res) {
    console.log('addOffersPage is called in post module.');
    // offers page
    console.log('[offers.js] /add_offers path is requested.');

    // If we have auth of this user, req.user has user informations. unless, req.user is false.
    console.log('[offers.js] value of req.user object.');
    console.dir(req.user);

    // Not authenticated cases
    if (!req.user) {
        console.log('[offers.js] We need user auth.');
        res.redirect('/');
    } else {
        console.log('[offers.js] We have user auth.');
        console.log('[offers.js] /add_offers path is requested.');
        console.dir(req.user);
        
        if (Array.isArray(req.user)) {
            res.render('addOffers.ejs', { user: req.user[0]._doc, login_success: true });
        } else {
            res.render('addOffers.ejs', { user: req.user, login_success: true });
        }
    }
}

var addOffers = function (req, res) {
    console.log('addOffers is called in post module.');
    //console.log('req...');
    //console.log(req);

    console.log('body : ' + JSON.stringify(req.body));
    console.log('query : ' + JSON.stringify(req.query));
    console.log('user name : ' + req.user.name || res.user.name);
    var id = req.body.id || req.query.id;
    var name = req.user.name || res.user.name;
	var orderType = req.body.orderType;
	var amountMin = req.body.amountMin;
	var amountMax = req.body.amountMax;
	var price     = 1;
	var country   = req.body.country;
	var currency  = 'WON';
	var paymentType  = req.body.paymentType;
    
	var database = req.app.get('database');
    
	if (database.db) {
		
	    database.UserModel.findByName(req.user.name || res.user.name, function(err, results) {
	        if (err) {
	        	res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>' + err + '</h2>');
				res.end();
	        }
	        if (results == undefined || results.length < 1) {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2> Cannot find User [' + (req.user.name || res.user.name) + '].</h2>');
				res.end();	
				return;
			}

            //console.log('countryObj : ' + JSON.stringify(results.countryObj));
            //console.log('currencyObj : ' + JSON.stringify(results.currencyObj));

        	var orderObj = new database.OfferModel({
                country: country,
                currency: currency,
                user:name,
                paymentType: paymentType,
				type: orderType, 
				amount_min: amountMin,
				amount_max: amountMax,
				price: price
			});

	        console.log(orderObj);

	        orderObj.saveOffer(function(err, result) {
				if (err) {
                    if (err) {
                        console.error('[offer.js] An error occured making response web document. : ' + err.stack);

                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>An error occured making response web document.</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }
                }

                return res.redirect('/'); 
			});

			return res.redirect('/');
	    });		
		
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>Database connection failed</h2>');
		res.end();
	}
}

module.exports.listOffers = listOffers;
module.exports.addOffersPage = addOffersPage;
module.exports.addOffers = addOffers;