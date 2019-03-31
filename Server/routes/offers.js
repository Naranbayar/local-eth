var listOffers = function (req, res) {
    console.log('listOffers is called in post module.');
    // offers page
    console.log('[offers.js] /offers path is requested.');

    // If we have auth of this user, req.user has user informations. unless, req.user is false.
    console.log('[offers.js] value of req.user object.');
    console.dir(req.user);

    // Not authenticated cases
    if (!req.user) {
        console.log('[offers.js] We need user auth.');
        res.redirect('/');
    } else {
        console.log('[offers.js] We have user auth.');
        console.log('[offers.js] /offers path is requested.');
        console.dir(req.user);

        if (Array.isArray(req.user)) {
            res.render('offers.ejs', { user: req.user[0]._doc, login_success: true });
        } else {
            res.render('offers.ejs', { user: req.user, login_success: true });
        }
    }
}

var addOffers = function (req, res) {
    console.log('addOffers is called in post module.');

}

module.exports.listOffers = listOffers;
module.exports.addOffers = addOffers;