var listBrowse = function (req, res) {
    console.log('listBrowse is called in post module.');
    // browse page
    console.log('[browse.js] /browse path is requested.');

    // If we have auth of this user, req.user has user informations. unless, req.user is false.
    console.log('[browse.js] value of req.user object.');
    console.dir(req.user);

    // Not authenticated cases
    if (!req.user) {
        console.log('[browse.js] We need user auth.');
        res.redirect('/');
    } else {
        console.log('[browse.js] We have user auth.');
        console.log('[browse.js] /browse path is requested.');
        console.dir(req.user);

        if (Array.isArray(req.user)) {
            res.render('browse.ejs', { user: req.user[0]._doc, login_success: true });
        } else {
            res.render('browse.ejs', { user: req.user, login_success: true });
        }
    }
}

var addBrowse = function (req, res) {
    console.log('addBrowse is called in post module.');

}

module.exports.listBrowse = listBrowse;
module.exports.addBrowse = addBrowse;