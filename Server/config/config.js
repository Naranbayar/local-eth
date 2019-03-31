
/*
 * config file
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
        {file:'./user_schema', collection:'User', schemaName:'UserSchema', modelName:'UserModel'},
		{file:'./post_schema', collection:'Post', schemaName:'PostSchema', modelName:'PostModel'},
		{file:'./order_schema', collection:'Order', schemaName:'OrderSchema', modelName:'OrderModel'},
		{file:'./country_schema', collection:'Country', schemaName:'CountrySchema', modelName:'CountryModel', defaultFile:'country.txt'},
		{file:'./currency_schema', collection:'Currency', schemaName:'CurrencySchema', modelName:'CurrencyModel', defaultFile:'currency.txt'},
	],
	route_info: [
        {file:'./post', path:'/process/addpost', method:'addpost', type:'post'},
        {file:'./post', path:'/process/showpost/:id', method:'showpost', type:'get'},
        {file:'./post', path:'/process/listpost', method:'listpost', type:'post'},
        {file:'./post', path:'/process/listpost', method:'listpost', type:'get'},

        {file:'./order', path:'/process/addOrder', method:'addOrder', type:'post'},
        {file:'./order', path:'/process/newOrder', method:'newOrder', type:'get'},
        {file:'./order', path:'/process/showOrder/:id', method:'showOrder', type:'get'},
        {file:'./order', path:'/process/listOrder', method:'listOrder', type:'post'},
		{file:'./order', path:'/process/listOrder', method:'listOrder', type:'get'},
		{file:'./wallet', path:'/wallet', method:'addWallet', type:'post'},
		{file:'./wallet', path:'/wallet', method:'listWallet', type:'get'},
		{file:'./browse', path:'/browse', method:'addBrowse', type:'post'},
		{file:'./browse', path:'/browse', method:'listBrowse', type:'get'},
		{file:'./trades', path:'/trades', method:'addTrades', type:'post'},
		{file:'./trades', path:'/trades', method:'listTrades', type:'get'},
		{file:'./offers', path:'/offers', method:'addOffers', type:'post'},
		{file:'./offers', path:'/offers', method:'listOffers', type:'get'},
	],
	facebook: {		// passport facebook
		clientID: '1442860336022433',
		clientSecret: '13a40d84eb35f9f071b8f09de10ee734',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {		// passport twitter
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/twitter/callback'
	},
	google: {		// passport google
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/google/callback'
	}
}