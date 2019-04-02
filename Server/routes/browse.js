var listBrowse = function (req, res) {
    console.log('listBrowse is called in browse module.');
    // browse page
    console.log('[browse.js] /browse path is requested.');

    // If we have auth of this user, req.user has user informations. unless, req.user is false.
    console.log('[browse.js] value of req.user object.');
    console.dir(req.user);
    var database = req.app.get('database');
    // The case when database object is initialized
    if (database.db) {
        database.OfferModel.findActives(req.user.name, function (err, results) {
            console.log('///////////////////////////');
            console.log('buys.length' + results.length);
            for (var i = 0; i < results.length; i++) {
                console.log('/////////////////////////////');
                console.log(results[i]);
            }
            if (Array.isArray(req.user)) {
                res.render('browse.ejs', { user: req.user[0]._doc, login_success: true, buys: results, sells: results });
            } else {
                res.render('browse.ejs', { user: req.user, login_success: true, buys: results, sells: results });
            }
        });
    } else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>Database connection failed</h2>');
        res.end();
    }

    // Not authenticated cases
    if (!req.user) {
        console.log('[browse.js] We need user auth.');
        res.redirect('/');
    } else {
        console.log('[browse.js] We have user auth.');
        console.log('[browse.js] /browse path is requested.');
        console.dir(req.user);
        /*
        if (Array.isArray(req.user)) {
            res.render('browse.ejs', { user: req.user[0]._doc, login_success: true, buys:buys, sells:sells});
        } else {
            res.render('browse.ejs', { user: req.user, login_success: true, buys:buys, sells:sells});
        }
        */
    }
}

var addBrowse = function (req, res) {
    console.log('addBrowse is called in browse module.');

}

var updateBrowse = function (req, res) {
    console.log('updateBrowse is called in browse module.');
    var database = req.app.get('database');
    // The case when database object is initialized
    if (database.db) {
        database.OfferModel.updateBrowse(req.params.id, function (err, results) {
            console.log('///////////////////////////////////////////////////////////');
            console.log('results.length');
            console.log(results.length);
            console.log('req.params.id');
            console.log(req.params.id);
            console.log('///////////////////////////////////////////////////////////');
            res.redirect('/browse');
        });
    } else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>Database connection failed</h2>');
        res.end();
    }

    // Not authenticated cases
    if (!req.user) {
        console.log('[browse.js] We need user auth.');
        res.redirect('/');
    } else {
        console.log('[browse.js] We have user auth.');
        console.log('[browse.js] /browse path is requested.');
        console.dir(req.user);
    }
}

module.exports.listBrowse = listBrowse;
module.exports.addBrowse = addBrowse;
module.exports.updateBrowse = updateBrowse;