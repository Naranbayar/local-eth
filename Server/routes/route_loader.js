/**
 * Setting informations  from routing module
 * 
 * Informations in routing module is registered in route_info Arrays in config.js
 *
 * @date 2016-11-10
 * @author Mike
 */

var route_loader = {};

var config = require('../config/config');


route_loader.init = function(app, router) {
	console.log('route_loader.init is called.');
	return initRoutes(app, router);
};

// Handling routing informations defined in route_info
function initRoutes(app, router) {
	var infoLen = config.route_info.length;
	console.log('[route_loader.js] the number of routing module in config : %d', infoLen);
 
	for (var i = 0; i < infoLen; i++) {
		var curItem = config.route_info[i];
			
		// calling module from module file
		var curModule = require(curItem.file);
		console.log('[route_loader.js] reading module informations in %s file.', curItem.file);
		
		//  Handling routing
		if (curItem.type == 'get') {
            router.route(curItem.path).get(curModule[curItem.method]);
		} else if (curItem.type == 'post') {
            router.route(curItem.path).post(curModule[curItem.method]);
		} else {
			router.route(curItem.path).post(curModule[curItem.method]);
		}
		
		
		console.log('[route_loader.js] setting [%s] routing module.', curItem.method);
	}

    // Registration of Route object
    app.use('/', router);
}

module.exports = route_loader;

