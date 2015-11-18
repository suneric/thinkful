var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define Objects, Dish, Diner
// Dish object
var Dish = function(name, price) {
	this.name = name;
	this.price = price;
};

Dish.prototype.Name = function() {
	return this.name;
};

Dish.prototype.Price = function() {
	return this.price;
};

// Diner object
var Diner = function() {
	this.dishes = new Array;
	this.tipPercentage = 0.2; // 20% tip percentage  
};

Diner.prototype.AddDish = function(name, price) {
	var dish = new Dish(name, price);
	this.dishes.push(dish);
};

Diner.prototype.NumberOfDishes = function() {
	return this.dishes.length;
};

Diner.prototype.SumOfBill = function() {
	var sum = 0;
	this.dishes.forEach(function(dish){
		sum += dish.Price();
	});
	
	return sum;
};

// fixed tax percentage
Diner.prototype.TaxPercentage = function() {
	return 0.17;
};

Diner.prototype.Tax = function() {
	return this.SumOfBill()*this.TaxPercentage();
};

Diner.prototype.SetTipPercentage = function(tipPercentage) {
	this.tipPercentage = tipPercentage;
};

Diner.prototype.TipPercentage = function() {
	return this.tipPercentage;
};

Diner.prototype.Tip = function() {
	return this.SumOfBill()*this.TipPercentage();
};

Diner.prototype.TotalBill = function() {
	var sum = this.SumOfBill();
	console.log("Dishes: $" + sum + "\n");
	var tax = this.Tax();
	console.log("Tax(17%): $" + tax + "\n");
	var tip = this.Tip();
	console.log("Tip: $" + tip + "\n");
	var total = sum + tax + tip;
	console.log("Total Bill: $" + total + "\n");
};

Diner.prototype.SplitBill = function(round) {
	
	var number = this.dishes.length;
	var tipShare = this.Tip()/number;
	var taxpercentage = this.TaxPercentage();
	
	// array for discrapency; 
	var feeArray = new Array(number);
	
	var sum = 0;
	this.dishes.forEach(function(dish){
		
		var tax = dish.Price() * taxpercentage;
		var total = dish.Price() + tax + tipShare;
		
		if (round === false) {
			console.log("++" + dish.Name() + " should pay $" + total + "\n");
			console.log("----$" + dish.Price() + " food price.\n");
			console.log("----$" + tax + " tax.\n");
			console.log("----$" + tipShare + " tip.\n");
		}
		else {		
			// save single pay for round
			var singlePay = {
				s_name : dish.Name(),
				s_price : dish.Price(),
				s_total : total,
				s_tax : tax
			};

			feeArray.push(singlePay);
			sum += total;
		}
	});
	
	if (round === true)
	{
		if (sum > this.SumOfBill())
		{
			console.log("==round amount is more than total bill.\n");
			var diff = sum-this.SumOfBill();
			for (var i = 0; i < feeArray.length; ++i)
			{
				// confused here?
				if (feeArray[i] === undefined)
					continue;
				
				var totalChange = feeArray[i]['s_total'] - diff/feeArray.length;
				console.log("++Dish: " + feeArray[i]['s_name'] + " should pay $" + totalChange + "\n");
				console.log("----$" + feeArray[i]['s_price'] + " for food.\n");
				console.log("----$" + feeArray[i]['s_tax'] + " for tax.\n");
				console.log("----$" + tipShare + " for tip.\n");
			}
		}
		else if (sum < this.SumOfBill())
		{
			console.log("==round amount is less than total bill.\n");
			var diff = this.SumOfBill() - sum;
			for (var i = 0; i < feeArray.length; ++i)
			{
				if (feeArray[i] === undefined)
					continue;
				
				var totalChange = feeArray[i]['s_total'] + diff/feeArray.length;
				console.log("++Dish: " + feeArray[i]['s_name'] + " should pay $" + totalChange + "\n");
				console.log("----$" + feeArray[i]['s_price'] + " for food.\n");
				console.log("----$" + feeArray[i]['s_tax'] + " for tax.\n");
				console.log("----$" + tipShare + " for tip.\n");
			}
		} else {
			console.log("==round amount is equal to total bill.\n");
			for (var i = 0; i < feeArray.length; ++i)
			{
				if (feeArray[i] === undefined)
					continue;
				
				var totalChange = feeArray[i]['s_total'];
				console.log("++Dish: " + feeArray[i]['s_name'] + " should pay $" + totalChange + "\n");
				console.log("----$" + feeArray[i]['s_price'] + " for food.\n");
				console.log("----$" + feeArray[i]['s_tax'] + " for tax.\n");
				console.log("----$" + tipShare + " for tip.\n");
			}
		}
	}
};

////////////////////////////////////////////////
console.log(":) Welcome to Eric's Diner.\n");
console.log(":) Here is the menu, please order your food.\n");
console.log("---------------------MENU-------------------\n")
console.log("1. Smoky Cheese Ball ---------------  $18.72\n");
console.log("2. Oyster Bars ---------------------  $15.60\n");
console.log("3. Peaches and Cream ---------------  $22.35\n");
console.log("4. Healthy Banana Bread ------------  $16.80\n");
console.log("5. Cowgirl Chili -------------------  $25.00\n");
console.log("6. Spicy Oven Fried Chicken --------  $33.33\n");
console.log("7. Cherry-Cranberry Pork Loin ------  $19.95\n");
console.log("8. Sesame Fried Shrimp -------------  $28.20\n");
console.log("9. Banana Pancakes -----------------  $15.50\n");
console.log("--------------------------------------------\n")
console.log("Please pick the number for order your food.\n");

rl.setPrompt('Order> ');
rl.prompt();

var diner = new Diner();
rl.on('line', function(cmd){
	if (cmd === '1') {
		diner.AddDish('Smoky Cheese Ball', 18.72);
		console.log("You just ordered 'Smoky Cheese Ball ($18.72)'.\n Please pick the number for another dish.");
	} else if (cmd === '2') {
		diner.AddDish('Oyster Bars', 15.60);
		console.log("You just ordered 'Oyster Bars' ($15.60)'.\n Please pick the number for another dish.");
	} else if (cmd === '3') {
		diner.AddDish('Peaches and Cream', 22.35);
		console.log("You just ordered 'Peaches and Cream ($22.35)'.\n Please pick the number for another dish.");
	} else if (cmd === '4') {
		diner.AddDish('Healthy Banana Bread', 16.80);
		console.log("You just ordered 'Healthy Banana Bread ($16.80)'.\n Please pick the number for another dish.");
	} else if (cmd === '5') {
		diner.AddDish('Cowgirl Chili', 25.00);
		console.log("You just ordered 'Cowgirl Chili ($25.00)'.\n Please pick the number for another dish.");
	} else if (cmd === '6') {
		diner.AddDish('Spicy Oven Fried Chicken', 33.33);
		console.log("You just ordered 'Spicy Oven Fried Chicken ($33.33)'.\n Please pick the number for another dish.");
	} else if (cmd === '7') {
		diner.AddDish('Spicy Oven Fried Chicken', 19.95);
		console.log("You just ordered 'Spicy Oven Fried Chicken ($19.95)'.\n Please pick the number for another dish.");
	} else if (cmd === '8') {
		diner.AddDish('Sesame Fried Shrimp', 28.20);
		console.log("You just ordered 'Sesame Fried Shrimp' ($28.20)'.\n Please pick the number for another dish.");
	} else if (cmd === '9') {
		diner.AddDish('Banana Pancakes', 15.50);
		console.log("You just ordered 'Banana Pancakes ($15.50)'.\n Please pick the number for another dish.");
	} else {
		console.log("Thanks for your order, enjoy your food.\n");
		rl.question("How many percent of tip would you like to give?\n", function(answer){
			console.log("Thanks for your generosity, you just gave " + answer +"% tip.\n");
			diner.SetTipPercentage(answer/100);
			console.log("Here is your bill.\n");
			diner.TotalBill();
			
			if (diner.NumberOfDishes() > 1)
			{
				rl.question("Do you want to split the bill? (y/n)\n", function(answer){
					if (answer === 'y') {
						diner.SplitBill(true);
					}
					
					console.log("Thanks for your payment. Goodbye.\n");	
					rl.close();
				});				
			}
			else {
				console.log("Thanks for your payment. Goodbye.\n");	
				rl.close();
			}
		});
	}
	
	rl.prompt();
	
}).on('close', function(){
	console.log("Have a nice day.");
	process.exit(0);
});



