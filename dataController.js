/**
 * Created with JetBrains WebStorm.
 * User: aethe_000
 * Date: 3/17/13
 * Time: 7:45 PM
 * To change this template use File | Settings | File Templates.
 */

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ToDoDataProvider = function(host, port) {
    this.db= new Db('node-mongo-todo', new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function(){});
};

ToDoDataProvider.prototype.getCollection= function(callback) {
    this.db.collection('todoitems', function(error, todo_item_collection) {
        if( error ) callback(error);
        else callback(null, todo_item_collection);
    });
};

ToDoDataProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, todo_item_collection) {
        if( error ) callback(error)
        else {
            todo_item_collection.find().toArray(function(error, results) {
                if( error ) callback(error)
                else callback(null, results)
            });
        }
    });
};

ToDoDataProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, todo_item_collection) {
        if( error ) callback(error)
        else {
            todo_item_collection.findOne({_id: todo_item_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
                if( error ) callback(error)
                else callback(null, result)
            });
        }
    });
};

ToDoDataProvider.prototype.save = function(todo_items, callback) {
    this.getCollection(function(error, todo_item_collection) {
        if( error ) callback(error)
        else {
            if( typeof(todo_items.length)=="undefined")
                todo_items = [todo_items];

            for( var i =0;i< todo_items.length;i++ ) {
                var todo_item = todo_items[i];
                todo_item.created_at = new Date();
                if( todo_item.desc === undefined ) todo_item.desc = '';
                if( todo_item.status === undefined ) todo_item.status = '0';
                if( todo_item.ref === undefined ) todo_item.ref = Math.floor(Math.random()*1000000);
            }

            todo_item_collection.insert(todo_items, function() {
                callback(null, todo_items);
            });
        }
    });
};

ToDoDataProvider.prototype.markComplete = function(ref, callback) {
    this.getCollection(function(error, todo_item_collection) {
        if( error ) callback(error);
        else {
            todo_item_collection.update(
                {ref: ref},
                { $set: {'status':'1'} },
                function(error, todo_items) {
                    if(error) callback(error);
                    else callback(null, todo_items)
                });
        }
    });
};

ToDoDataProvider.prototype.remove = function(ref, callback) {
    this.getCollection(function(error, todo_item_collection) {
        if(error) callback(error);
        else {
            todo_item_collection.remove(
                {ref: ref},
                function(error, todo_item){
                    if(error) callback(error);
                    else callback(null, todo_item)
                });
        }
    });
};

exports.ToDoDataProvider = ToDoDataProvider;