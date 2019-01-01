var MongoClient = require('mongodb').MongoClient;	// require the mongodb driver

/**
 * Uses mongodb v3.1.9 - [API Documentation](http://mongodb.github.io/node-mongodb-native/3.1/api/)
 * StoreDB wraps a mongoDB connection to provide a higher-level abstraction layer
 * for manipulating the objects in our bookstore app.
 */
function StoreDB(mongoUrl, dbName){
	if (!(this instanceof StoreDB)) return new StoreDB(mongoUrl, dbName);
	this.connected = new Promise(function(resolve, reject){
		MongoClient.connect(
			mongoUrl,
			{
				useNewUrlParser: true
			},
			function(err, client){
				if (err){
					console.log(err);
					reject(err);
				}
				else {
					console.log('[MongoClient] Connected to '+mongoUrl+'/'+dbName);
					resolve(client.db(dbName));

				}
			}
		)
		
	});
}

StoreDB.prototype.getProducts = function(queryParams){
	return this.connected.then( function(db){
		return db.collection("products").find(queryParams).toArray();
	}).catch(function(err){
		console.log("Error " + err.message);
	});
}


StoreDB.prototype.addOrder = function(order){
	return this.connected.then(function(db){
			var cartObject = order.cart;
			var variable;
			console.log(cartObject['Box1']);
			for(key in cartObject){
					variable = -cartObject[key];
					db.collection("products").updateOne({_id:key},{$inc:{quantity: variable}});
			}
			console.log(cartObject);

			return db.collection('orders').insertOne(order);
	}).catch(function(err){
		console.log("Error " + err.message);
	});
}

module.exports = StoreDB;
