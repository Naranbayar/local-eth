/*
 * Routing Definition for Board 
 * 
 * @date 2016-11-10
 * @author Mike
 */

// html-entities module is required in showpost.ejs
var Entities = require('html-entities').AllHtmlEntities;


var addpost = function(req, res) {
	console.log('addpost is called in post module.');
 
    var paramTitle = req.body.title || req.query.title;
    var paramContents = req.body.contents || req.query.contents;
    var paramWriter = req.body.writer || req.query.writer;
	
    console.log('Requested parameter : ' + paramTitle + ', ' + paramContents + ', ' + 
               paramWriter);
    
	var database = req.app.get('database');
	
	// The case when database object is initialized
	if (database.db) {
		
		// 1. Searching User by Id
		database.UserModel.findByEmail(paramWriter, function(err, results) {
			if (err) {
                console.error('An error occured in course of making writing of the board : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>An error occured in course of making writing of the board</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }

			if (results == undefined || results.length < 1) {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2> Cannot find User [' + paramWriter + '].</h2>');
				res.end();
				
				return;
			}
			
			var userObjectId = results[0]._doc._id;
			console.log('User ObjectId : ' + paramWriter +' -> ' + userObjectId);
			
			// save using save()
			// Generating PostModel instance
			var post = new database.PostModel({
				title: paramTitle,
				contents: paramContents,
				writer: userObjectId
			});

			post.savePost(function(err, result) {
				if (err) {
                    if (err) {
                        console.error('An error occured making response web document. : ' + err.stack);

                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>An error occured making response web document.</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }
                }
				
			    console.log("Added writing data.");
			    console.log('writing', 'Generated Post writing. : ' + post._id);
			    
			    return res.redirect('/process/showpost/' + post._id); 
			});
			
		});
		
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>Database connection failed</h2>');
		res.end();
	}
	
};

var listpost = function(req, res) {
	console.log('listpost is called in post module.');
  
    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;
	
    console.log('Requested parameter : ' + paramPage + ', ' + paramPerPage);
    
	var database = req.app.get('database');
	
    // The case when database object is initialized
	if (database.db) {
		// 1. List of objects
		var options = {
			page: paramPage,
			perPage: paramPerPage
		}
		
		database.PostModel.list(options, function(err, results) {
			if (err) {
                console.error('An error occured in the list of board. : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>An error occured in the list of board.</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
			if (results) {
				console.dir(results);
 
				// Checking the number of objects in whole document
				database.PostModel.count().exec(function(err, count) {

					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					
					// Send after rendering using view template
					var context = {
						title: 'List of writing',
						posts: results,
						page: parseInt(paramPage),
						pageCount: Math.ceil(count / paramPerPage),
						perPage: paramPerPage, 
						totalRecords: count,
						size: paramPerPage
					};
					
					req.app.render('listpost', context, function(err, html) {
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


var showpost = function(req, res) {
	console.log('showpost is called in post module.');
  
    // It's passed to URL parameter
    var paramId = req.body.id || req.query.id || req.params.id;
	
    console.log('Requested parameter : ' + paramId);
    
    
	var database = req.app.get('database');
	
    // The case when database object is initialized
	if (database.db) {
		// 1. List of objects
		database.PostModel.load(paramId, function(err, results) {
			if (err) {
                console.error('There\'s an error in course of making list of objects: ' + err.stack);
                
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
				var context = {
					title: 'List of writings',
					posts: results,
					Entities: Entities
				};
				
				req.app.render('showpost', context, function(err, html) {
					if (err) {
                        console.error('An error occured making response web document. : ' + err.stack);
                
                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>An error occured making response web document.</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }
					
					console.log('Response web document : ' + html);
					res.end(html);
				});
			 
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

module.exports.listpost = listpost;
module.exports.addpost = addpost;
module.exports.showpost = showpost;
