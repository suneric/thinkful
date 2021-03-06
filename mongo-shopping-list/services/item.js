var Item = require('../models/item');

exports.save = function(name, callback, errback) {
    Item.create({ name: name}, function(err, item) {
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    });
};

exports.list = function(callback, errback) {
    Item.find(function(err, items) {
        if (err) {
            errback(err);
            return;
        }
        callback(items);
    });
};

exports.update = function(id, name, callback, errback) {
	// findByIdAndUpdate or findOneAndUpdate
	Item.findOneAndUpdate(id, {name: name}, function(err, item) {
		if (err) {
			errback(err);
			return;
		}
		callback(item);
	});
};

exports.del = function(id, callback, errback) {
	// findByIdAndRemove or findOneAndRemove
	Item.findOneAndRemove(id, function (err, item) {
		if (err) {
			errback(err);
			return;
		}
		callback(item);
	});
};