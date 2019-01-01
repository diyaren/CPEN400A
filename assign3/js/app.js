var inactiveTime = 0;
var popUp = setInterval(function(){ alert("Hey there! Are you still planning to buy something?"); }, 300000);

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
	this.onUpdate = null;

}

Store.prototype.addItemToCart = function(itemName) {
	clearInterval(popUp);
	popUp = setInterval(function(){ alert("Hey there! Are you still planning to buy something?"); }, 300000);
	inactiveTime = 0;
	if(this.stock[itemName].quantity > 0){
		if(this.cart[itemName]==undefined){
			this.cart[itemName]= 1;
			this.stock[itemName].quantity--;
			
		}else{
			this.cart[itemName]++;
			this.stock[itemName].quantity--;
		}
		
	}
	else
		alert('Out of stock!');

	this.onUpdate(itemName);
};


Store.prototype.removeItemFromCart = function(itemName) {
	clearInterval(popUp);
	popUp = setInterval(function(){ alert("Hey there! Are you still planning to buy something?"); }, 30000);
	inactiveTime = 0;
	
	if(this.cart[itemName] > 1 ){
		this.cart[itemName]--;
		this.stock[itemName].quantity++;

	}else if(this.cart[itemName] == 1){
		this.stock[itemName].quantity = 5;
		delete this.cart[itemName];

	}else{
		alert('No such item in cart!');
	}
	this.onUpdate(itemName);
};

var store = new Store(products);
store.onUpdate = function(itemName){
		var newli = document.createElement('li');
		var pNew = renderProduct(newli,this,itemName);
		var pOld = document.getElementById("product-"+itemName);
		pOld.parentNode.replaceChild(pNew, pOld);

		var modal_content = document.getElementById("modal-content");
		renderCart(modal_content, this);
}


function showCart(){

	clearInterval(popUp);
	popUp = setInterval(function(){ alert("Hey there! Are you still planning to buy something?"); }, 30000);
	inactiveTime = 0;	

	var modal = document.getElementById("modal")
	modal.style.display = "block";

	var content = document.getElementById("modal-content");
	renderCart(content, store);

}

function hideCart(){
	var modal = document.getElementById("modal")
	modal.style.display = "none";
}

function inactiveTimeStart(){
	if(inactiveTime == 30)
		inactiveTime = 1;
	else
		inactiveTime++;

	var time = setTimeout(inactiveTimeStart,1000);

}


function renderProduct(container,storeInstance,itemName){
	var id = "product-"+itemName;
	container.setAttribute('id',id);
	container.setAttribute('class','product');
	var div = document.createElement('div');
	div.setAttribute('id','hoverprice');
	var img = document.createElement('img');
	img.setAttribute('src',storeInstance.stock[itemName].imageUrl);
	img.setAttribute('alt',storeInstance.stock[itemName].label);
	img.setAttribute('width',228);
	img.setAttribute('height',160);
	div.appendChild(img);

	if((storeInstance.stock[itemName].quantity!=0) || (storeInstance.cart[itemName]!=0)){
		var divButtons = document.createElement('div');
		divButtons.setAttribute('class','buttons');	
		if(storeInstance.stock[itemName].quantity!=0){
			var addButton = document.createElement('BUTTON');
		    addButton.setAttribute('class','btn-add');
		    addButton.setAttribute('onclick',"store.addItemToCart(\""+itemName+"\")");
		    var addText = document.createTextNode('Add');
		    addButton.appendChild(addText);
		    divButtons.appendChild(addButton);
	
		} 
		if (storeInstance.cart[itemName] > 0){
			var removeButton = document.createElement('BUTTON');
		    removeButton.setAttribute('class','btn-remove');
		    removeButton.setAttribute('onclick',"store.removeItemFromCart(\""+itemName+"\")");
		    var addText = document.createTextNode('Remove');
		    removeButton.appendChild(addText);
		    divButtons.appendChild(removeButton);
		}

	    div.appendChild(divButtons);

	}	

    var pPrice = document.createElement('p');
    var priceText = document.createTextNode(storeInstance.stock[itemName].price+"$");
    pPrice.appendChild(priceText);
    div.appendChild(pPrice);

    var pDesc = document.createElement('p');
    var descText = document.createTextNode(itemName);
    pDesc.appendChild(descText);
    div.appendChild(pDesc);

    container.appendChild(div);
    return container;

}

function renderProductList(container,storeInstance){
 	var ul = document.createElement("ul");
 	ul.setAttribute('id',"productList");
 	var length = Object.keys(storeInstance.stock).length;
 	var li;
 	for(var i=0; i<length ;i++){
 		var li= document.createElement('li');
 		li = renderProduct(li,storeInstance,Object.keys(storeInstance.stock)[i]);
 		ul.appendChild(li);
 	}
 	if(ul){
 		container.appendChild(ul);
 	}	
}

function renderCart(container, storeInstance){
	//create table
	var table = document.createElement('table');
	var cartDetail = Object.keys(storeInstance.cart);

	var row = document.createElement('tr');
	var title = document.createTextNode("Your Cart: ");
	row.appendChild(title);
	table.appendChild(row);

	var row = document.createElement('tr');
	table.appendChild(row);

	var row = document.createElement('tr');
	var entry = document.createElement('td');
	entry.appendChild(document.createTextNode('Item Name'));
	row.appendChild(entry);

	var entry = document.createElement('td');
	entry.appendChild(document.createTextNode('Amount'));
	row.appendChild(entry);

	var entry = document.createElement('td');
	entry.appendChild(document.createTextNode('Cost'));
	row.appendChild(entry);

	var entry = document.createElement('td');
	// entry.appendChild(document.createTextNode(' '));
	row.appendChild(entry);

	table.appendChild(row);

	var totalPrice = 0;

	cartDetail.forEach(function(itemName){
		var row = document.createElement('tr');
		row.setAttribute('id',itemName+'-row');

		var name = document.createTextNode(storeInstance.stock[itemName].label);
		var entry = document.createElement('td');
		entry.appendChild(name);
		row.appendChild(entry);

		var number = document.createTextNode(storeInstance.cart[itemName] + " ");
		var entry = document.createElement('td');
		entry.appendChild(number);
		row.appendChild(entry);

		var priceNumber = storeInstance.cart[itemName] * storeInstance.stock[itemName].price;
		totalPrice = totalPrice + priceNumber;
		var price = document.createTextNode("   " + priceNumber + "$");

		var entry = document.createElement('td');
		entry.appendChild(price);
		row.appendChild(entry);


		var addButton = document.createElement('BUTTON');
		addButton.setAttribute('onclick',"store.addItemToCart(\""+itemName+"\")");
		addButton.appendChild(document.createTextNode('+'));
	
		var removeButton = document.createElement('BUTTON');
		removeButton.setAttribute('onclick',"store.removeItemFromCart(\""+itemName+"\")");
		removeButton.appendChild(document.createTextNode('-'));

		var entry = document.createElement('td');
		entry.appendChild(addButton);
		entry.appendChild(removeButton);
		row.appendChild(entry);

		table.appendChild(row);
	});
	var row = document.createElement('tr');
	table.appendChild(row);

	var row = document.createElement('tr');

	var priceTag = document.createTextNode("Total: ");
	var entry = document.createElement('td');
	entry.appendChild(priceTag);
	row.appendChild(entry);

	var entry = document.createElement('td');
	row.appendChild(entry);

	var totalPriceNode = document.createTextNode(totalPrice + "$");
	var entry = document.createElement('td');
	entry.appendChild(totalPriceNode);
	row.appendChild(entry);

	table.appendChild(row);

	while (container.firstChild) {
   		container.removeChild(container.firstChild);
	}
	container.appendChild(table);
}



function renderStart(){
	var productViewDiv = document.getElementById('productView');
	renderProductList(productViewDiv,store);
}


window.onload =function(){
	renderStart();
	inactiveTimeStart();
}

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  if (event.key == "Escape") {
    hideCart();
  } else return;

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);

