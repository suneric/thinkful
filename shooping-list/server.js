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
	if (id >= this.id || id < 0)
		return undefined;
		
	var item = this.items[id];
	return item;
};

// Delete the item with input id
Storage.prototype.delete = function(id){
	if (id >= this.id || id < 0)
		return;
	
	delete this.items[id];
};

// Update the item with input id
Storage.prototype.update = function(id, name){
	if (id >= this.id || id < 0)
		return;
	
	this.items[id].name = name;
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
	console.log(storage.items);
    res.status(201).json(item);
});

app.delete('/items/:id', function(req, res){
	var item = storage.find(req.params.id)
	if (item === undefined){
		res.status(404).json("Err: Incorrect id.");
	} else {
		// update the array?
		// if need to delete the undefined item in the array, use slice.
		storage.delete(item.id);
		console.log(storage.items);
		res.status(200).json(item);
	}
});

app.put('/items/:id', jsonParser, function(req, res){
	if (!req.body) {
        return res.sendStatus(400);
    }
	
	var item = storage.find(req.params.id)
	console.log(item);
	if (item === undefined){
		storage.add(req.body.name);
	} else {
		storage.update(req.params.id, req.body.name);
		console.log(storage.items);
		res.status(200).json(storage.items[item.id]);
	}
});

app.listen(process.env.PORT || 8080);