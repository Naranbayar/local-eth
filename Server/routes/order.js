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
                        console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
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
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}	
};

var listOrder = function(req, res) {
	console.log('order module 안에 있는 listOrder 호출됨.');
  
    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;
	
    console.log('listOrder params : ' + paramPage + ', ' + paramPerPage);
    
	var database = req.app.get('database');
	
    // 데이터베이스 객체가 초기화된 경우
	if (database.db) {
		// 1. 글 리스트
		var options = {
			page: paramPage,
			perPage: paramPerPage
		}
		
		database.OrderModel.list(options, function(err, results) {
			if (err) {
                console.error('something wrong on OrderModel.list : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>게시판 글 목록 List 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
			if (results) {
				console.dir(results);
 
				// 전체 문서 객체 수 확인
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
                            console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                            res.write('<p>' + err.stack + '</p>');
                            res.end();

                            return;
                        }
                        
						res.end(html);
					});
					
				});
				
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>글 목록 List  실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
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
                    console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
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
	console.log('post 모듈 안에 있는 showpost 호출됨.');
  
    // URL 파라미터로 전달됨
    var paramId = req.body.id || req.query.id || req.params.id;
	
    console.log('요청 파라미터 : ' + paramId);
    
    
	var database = req.app.get('database');
	
    // 데이터베이스 객체가 초기화된 경우
	if (database.db) {
		// 1. 글 리스트
		database.OrderModel.load(paramId, function(err, results) {
			if (err) {
                console.error('게시판 글 List 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>게시판 글 List 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
			if (results) {
				console.dir(results);
  
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				
				// 뷰 템플레이트를 이용하여 렌더링한 후 전송
				/*var context = {
					title: '글 List ',
					posts: results,
					Entities: Entities
				};
				
				req.app.render('showOrder', context, function(err, html) {
					if (err) {
                        console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);
                
                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }
					
					console.log('응답 웹문서 : ' + html);
					res.end(html);
				});*/
			 
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>글 List  실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};

module.exports.listOrder = listOrder;
module.exports.addOrder = addOrder;
module.exports.newOrder = newOrder;
module.exports.showOrder = showOrder;
