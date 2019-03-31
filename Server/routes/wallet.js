var listWallet = function (req, res) {
    console.log('listWallet is called in post module.');
    // wallet page
    console.log('[wallet.js] /wallet path is requested.');

    // If we have auth of this user, req.user has user informations. unless, req.user is false.
    console.log('[wallet.js] value of req.user object.');
    console.dir(req.user);

    // Not authenticated cases
    if (!req.user) {
        console.log('[wallet.js] We need user auth.');
        res.redirect('/');
    } else {
        console.log('[wallet.js] We have user auth.');
        console.log('[wallet.js] /wallet path is requested.');
        console.dir(req.user);

        if (Array.isArray(req.user)) {
            res.render('wallet.ejs', { user: req.user[0]._doc, login_success: true });
        } else {
            res.render('wallet.ejs', { user: req.user, login_success: true });
        }
    }
}

var addWallet = function (req, res) {
    console.log('addWallet is called in post module.');

}

module.exports.listWallet = listWallet;
module.exports.addWallet = addWallet;