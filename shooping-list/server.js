var express = require('express');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

// Add a new item to the storage
Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

// Query the item with input id
Storage.prototype.find = function(id) {
	console.log("find:"+id);
	for (var i = 0; i < this.items.length; ++i)
	{
		var item = this.items[i];
		console.log(item.id+item.name+(item.id == id));
		if (item.id == id)
			return item;
	}		
	
	return undefined;
};

// Delete the item with input id
Storage.prototype.delete = function(id){
	var item = this.find(id);
	if (item === undefined)
		return undefined;
	
	var index = this.items.indexOf(item);
	console.log("delete"+index);
	this.items.splice(index, 1);
	return item;
};

// Update the item with input id
Storage.prototype.update = function(id, name){
	var item = this.find(id);
	if (item === undefined)
		return this.add(name);
	
	var index = this.items.indexOf(item);
	console.log("find"+index);
	this.items[index].name = name;
	return this.items[index];
};


var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', jsonParser, function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', function(req, res){
	var item = storage.delete(req.params.id)
	if (item === undefined){
		res.status(404).json("Err: Incorrect id.");
	} else {
		res.status(200).json(item);
	}
});

app.put('/items/:id', jsonParser, function(req, res){
	if (!req.body) {
        return res.sendStatus(400);
    }
	
	var item = storage.update(req.params.id, req.body.name);
	if (item === undefined){
		res.status(404).json("Err: Incorrect id.");
	} else {
		res.status(200).json(item);
	}
});

app.listen(process.env.PORT || 8080);

exports.app = app;
exports.storage = storage;