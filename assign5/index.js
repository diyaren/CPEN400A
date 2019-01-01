// Require dependencies
var path = require('path');
var express = require('express');
var storeDB = require('./StoreDB.js');

var db = storeDB("mongodb://localhost:27017","cpen400a-bookstore");

// Declare application parameters
var PORT = process.env.PORT || 3000;
var STATIC_ROOT = path.resolve(__dirname, './public');

// Defining CORS middleware to enable CORS.
// (should really be using "express-cors",
// but this function is provided to show what is really going on when we say "we enable CORS")
function cors(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS,PUT");
  	next();
}

// Instantiate an express.js application
var app = express();

// Configure the app to use a bunch of middlewares
app.use(express.json());							// handles JSON payload
app.use(express.urlencoded({ extended : true }));	// handles URL encoded payload
app.use(cors);										// Enable CORS

app.use('/', express.static(STATIC_ROOT));			// Serve STATIC_ROOT at URL "/" as a static resource

// Configure '/products' endpoint
app.get('/products', function(request, response) {

	var minPrice = 0;;
	var maxPrice = Infinity;

	if (request.query.minPrice != undefined){
		minPrice = parseInt(request.query.minPrice, 10);
		// minPrice = request.query.minPrice;
	}
	if (request.query.maxPrice != undefined){
		maxPrice = parseInt(request.query.maxPrice, 10);
		// maxPrice = request.query.maxPrice;
	}
	var queryParams = {
		price:{$gte:minPrice, $lte:maxPrice},
	}
	if (request.query.category != undefined){
		queryParams.category = request.query.category;
	}

	var products = db.getProducts(queryParams);
	console.log("queryParams is: ");
	console.log(queryParams);
	products.then(
		function(content){
			var name;
			var returnObject = {};
			content.forEach(function(element,index){
				name = element._id;
				returnObject[name] = element;

			});
			response.json(returnObject);
			
		}, function(err){
			console.log(err);
		}
	);
});

app.post('/checkout', function(request, response) {
	console.log("Reuqest Body: ");
	console.log(request.body);
	var order = db.addOrder(request.body);
	
	order.then(function(orderContent){
	   response.json(orderContent);
	},function(err){
	   response.status = 500;
	   response.message = "post not successful: " + err;
	   response.send();
	})


});



// Start listening on TCP port
app.listen(PORT, function(){
    console.log('Express.js server started, listening on PORT '+PORT);
});