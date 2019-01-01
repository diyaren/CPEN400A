var inactiveTime = 0;
var popUp = setInterval(function(){ alert("Hey there! Are you still planning to buy something?"); }, 30000);

var products = {
	Clothes1:{label:'Clothes1',imageUrl:"images/Clothes1_$20.png",price:20,quantity:5},
	Clothes2:{label:"Clothes2",imageUrl:"images/Clothes2_$30.png",price:30,quantity:5},
	Jeans:{label:"Jeans",imageUrl:"images/Jeans_$50.png",price:50,quantity:5},
	Keyboard:{label:"Keyboard",imageUrl:"images/Keyboard_$20.png",price:20,quantity:5},
	Box1:{label:"Box1",imageUrl:"images/Box1_$10.png",price:10,quantity:5},
	Box2:{label:"Box2",imageUrl:"images/Box2_$5.png",price:5,quantity:5},
	KeyboardCombo:{label:"KeyboardCombo",imageUrl:"images/KeyboardCombo_$40.png",price:40,quantity:5},
	Mice:{label:"Mice",imageUrl:"images/Mice_$20.png",price:20,quantity:5},
	PC1:{label:"PC1",imageUrl:"images/PC1_$350.png",price:350,quantity:5},
	PC2:{label:"PC2",imageUrl:"images/PC2_$400.png",price:400,quantity:5},
	PC3:{label:"PC3",imageUrl:"images/PC3_$300.png",price:300,quantity:5},
	Tent:{label:"Tent",imageUrl:"images/Tent_$100.png",price:100,quantity:5}
}



var Store = function(initialStock){
	this.stock = initialStock;
	this.cart ={};

}


Store.prototype.addItemToCart = function(itemName) {
	clearInterval(popUp);
	popUp = setInterval(function(){ alert("Hey there! Are you still planning to buy something?"); }, 30000);
	inactiveTime = 0;
	if(this.stock[itemName].quantity > 0){
		if(!this.cart[itemName]){
			this.cart[itemName]= 1;
			// console.log("cart has" + this.cart[itemName].quantity);
			this.stock[itemName].quantity--;
			// console.log("stock has" + this.stock[itemName].quantity);
			
		}else{
			this.cart[itemName]++;
			this.stock[itemName].quantity--;
		}
	}
	else
		alert('Out of stock!');
};


Store.prototype.removeItemFromCart = function(itemName) {
	clearInterval(popUp);
	popUp = setInterval(function(){ alert("Hey there! Are you still planning to buy something?"); }, 30000);
	inactiveTime = 0;
	
	if(this.cart[itemName] > 1 ){
		this.cart[itemName]--;
		this.stock[itemName].quantity++;

	}else if(this.cart[itemName] == 1){
		delete this.cart[itemName];
		this.stock[itemName].quantity++;
	}
	else
		alert('No such item in cart!');

};

var store = new Store(products);


function showCart(){
	clearInterval(popUp);
	popUp = setInterval(function(){ alert("Hey there! Are you still planning to buy something?"); }, 30000);
	inactiveTime = 0;	
	var currentCart = '';
	for (var k in store.cart) {
		if (store.cart[k] > 0)
			currentCart += (k + ' : ' + store.cart[k] + '\n');
	}
	if (currentCart != '')
		alert(currentCart);
	else
		alert('Nothing in cart!');
}

function inactiveTimeStart(){
	if(inactiveTime == 30)
		inactiveTime = 1;
	else
		inactiveTime++;

	var time = setTimeout(inactiveTimeStart,1000);

}