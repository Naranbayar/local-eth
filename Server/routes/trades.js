var listTrades = function (req, res) {
    console.log('listTrades is called in post module.');
    // trades page
    console.log('[trades.js] /trades path is requested.');

    // If we have auth of this user, req.user has user informations. unless, req.user is false.
    console.log('[trades.js] value of req.user object.');
    console.dir(req.user);

    // Not authenticated cases
    if (!req.user) {
        console.log('[trades.js] We need user auth.');
        res.redirect('/');
    } else {
        console.log('[trades.js] We have user auth.');
        console.log('[trades.js] /trades path is requested.');
        console.dir(req.user);

        if (Array.isArray(req.user)) {
            res.render('trades.ejs', { user: req.user[0]._doc, login_success: true });
        } else {
            res.render('trades.ejs', { user: req.user, login_success: true });
        }
    }
}

var addTrades = function (req, res) {
    console.log('addTrades is called in post module.');

}

module.exports.listTrades = listTrades;
module.exports.addTrades = addTrades;