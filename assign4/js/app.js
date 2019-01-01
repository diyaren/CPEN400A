var inactiveTime = 0;
var popUp = setInterval(function(){ alert("Hey there! Are you still planning to buy something?"); }, 300000);

var productsURL = "https://cpen400a-bookstore.herokuapp.com";

var ajaxGet = function(url,onSuccess,onError,count){
		var URL = url;
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET",URL);
		// count = count + 1;
		xhttp.onreadystatechange = function(){
			if(this.readyState==4){
				if(xhttp.status == 200){
					console.log("try call onSuccess");
					response = JSON.parse(xhttp.responseText);
					onSuccess(response);
				}else if(xhttp.status==0 || xhttp.status == 500){
					if(count<3){
						ajaxGet(url,onSuccess,onError,count+1);
					}else{
						onError(xhttp.status);

					}
				}
					
			}
		}

		xhttp.timeout = 5000;
		console.log("Sending request " + xhttp);
		xhttp.send();

}

// var runReliable = ajaxGet(productsURL+"/test/reliabla",function(){"gets here"},function(){});
// runReliable();


var Store = function(serverUrl){
	this.stock = {};
	this.cart ={};
	this.onUpdate = null;
	this.serverUrl = serverUrl;
}

Store.prototype.syncWithServer = function(onSync, onFinish){
	console.log("\"this\" is:" + this);
	var object = this;
	ajaxGet(object.serverUrl+"/products", function(response){
		//response = JSON.parse(response);
		var delta = {};
		Object.keys(response).forEach(function(key) {

			if (object.stock[key] == undefined){
				object.stock[key] = response[key];
			} else {
				var cartQuantity = 0;
				if (object.cart[key] != undefined){
					cartQuantity = object.cart[key];
				}
				delta[key] = {};
				delta[key].quantity = response[key].quantity - cartQuantity - object.stock[key].quantity;
				delta[key].price = response[key].price - object.stock[key].price;

				object.stock[key].price = response[key].price;
				object.stock[key].quantity = response[key].quantity - cartQuantity;
				while (object.stock[key].quantity < 0){
					object.stock[key].quantity++;
					object.cart[key]--;
					console.log("item removed from cart due to change in stock (syncwithserver)");

					if (object.cart[key] < 0){
						console.log("error negative items in cart sync with server function");
					}
				}
			}
		});
		if (onSync != undefined) {
			onSync(delta, onFinish); // works but not neccesarily as intended
		}

		object.onUpdate();
	},function(error){
		console.log("Ajax Get Failed");
		onFinish();
	},0);
	// run();

}

Store.prototype.checkOut = function(onFinish){
	var object = this;
	this.syncWithServer(function(delta, onFinish){
		var alertString = "";
		console.log(object.stock);
		// Object.keys(delta).forEach(function(key) 
		for (var key in delta){
			if (delta[key].price != 0){
				var oldPrice = object.stock[key].price - delta[key].price;
				alertString = alertString + "Price of " + key +  " changed from $" + oldPrice + " to $" + object.stock[key].price + "\n";
			}
			if (delta[key].quantity != 0){
				var oldQuantity = object.stock[key].quantity - delta[key].quantity;
				alertString = alertString + "Quantity of " + key +  " changed from " + oldQuantity + " to " + object.stock[key].quantity + "\n";
			}
		}
		if (alertString != ""){
			alert(alertString);
		} else {
			var totalPrice = 0;
			for (var key in object.cart){
				totalPrice = totalPrice + (object.cart[key] * object.stock[key].price);
			}
			alert("Total cost is: $" + totalPrice);
		}
		
		if (onFinish != undefined){
			onFinish();
		}
	}, onFinish);
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



var store = new Store(productsURL);


store.onUpdate = function(itemName){
		if(itemName==null){
			renderStart();
			var modal_content = document.getElementById("modal-content");
			renderCart(modal_content, store);
		}else{
			var newli = document.createElement('li');
			var pNew = renderProduct(newli,this,itemName);
			if(pNew!=undefined){
				console.log(typeof pNew);
				var pOld = document.getElementById("product-"+itemName);
				pOld.parentNode.replaceChild(pNew, pOld);
			}
			var modal_content = document.getElementById("modal-content");
			renderCart(modal_content, this);			
			
		}
}

store.syncWithServer();



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

//onclick function
function checkOutCart(){
	if(document.getElementById("btn-check-out")!=null){
		document.getElementById("btn-check-out").disabled = true;
		store.checkOut(function(){
			store.onUpdate();
			document.getElementById("btn-check-out").disabled = false;
		});
	}
	
}

function inactiveTimeStart(){
	if(inactiveTime == 30)
		inactiveTime = 1;
	else
		inactiveTime++;

	var time = setTimeout(inactiveTimeStart,1000);

}


function renderProduct(container,storeInstance,itemName){
	console.log("\"this is: "+ storeInstance);
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

	if(document.getElementById("btn-check-out")==null){
		// var parent = container.parentNode;
		var checkOutButton = document.createElement('BUTTON');
		var buttonText = document.createTextNode("check out");
		checkOutButton.setAttribute('id','btn-check-out');
		checkOutButton.addEventListener('click',checkOutCart);
		checkOutButton.appendChild(buttonText);
		container.appendChild(checkOutButton);
	}

}

function renderStart(){
	var productViewDiv = document.getElementById('productView');
	if(productViewDiv.hasChildNodes()){
		productViewDiv.removeChild(productViewDiv.firstChild);
	}
	renderProductList(productViewDiv,store);
}

window.onload =function(){
	// getProducts();
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
