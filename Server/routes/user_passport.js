/**
 * Definition of Passport routing methods
 *
 * @date 2016-11-10
 * @author Mike
 */
  
module.exports = function(router, passport) {
    console.log('user_passport is called.');

    // Home page
    router.route('/').get(function(req, res) {
        console.log('[user_passports.js] / path is requested.');

        console.log('[user_passports.js] information of req.user');
        console.dir(req.user);

        // Not authenticated cases
        if (!req.user) {
            console.log('[user_passports.js] User auth is needed.');
            res.render('main_page.ejs', {login_success:false});
        } else {
            console.log('[user_passports.js] We have user auth.');
            res.render('main_page.ejs', {login_success:true});
        }
    });
    
    // Sign in page
    router.route('/login').get(function(req, res) {
        console.log('[user_passports.js] /login path is requested.');
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
	 
    // Sign up page
    router.route('/signup').get(function(req, res) {
        console.log('[user_passports.js] /signup path is requested.');
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });
	 
    // profile page
    router.route('/profile').get(function(req, res) {
        console.log('[user_passports.js] /profile path is requested.');

        // If we have auth of this user, req.user has user informations. unless, req.user is false.
        console.log('[user_passports.js] value of req.user object.');
        console.dir(req.user);

        // Not authenticated cases
        if (!req.user) {
            console.log('[user_passports.js] We need user auth.');
            res.redirect('/');
        } else {
            console.log('[user_passports.js] We have user auth.');
            console.log('[user_passports.js] /profile path is requested.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('profile.ejs', {user: req.user[0]._doc});
            } else {
                res.render('profile.ejs', {user: req.user});
            }
        }
    });
	
    // sign out
    router.route('/logout').get(function(req, res) {
        console.log('[user_passports.js] /logout path is requested.');
        req.logout();
        res.redirect('/');
    });


    // Sign in validation
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect : '/profile', 
        failureRedirect : '/login', 
        failureFlash : true 
    }));

    // Sign up validation
    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect : '/profile', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));

    // Passport - facebook authentication routing 
    router.route('/auth/facebook').get(passport.authenticate('facebook', { 
        scope : 'email' 
    }));

    // Passport - facebook authentication callback routing
    router.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

};