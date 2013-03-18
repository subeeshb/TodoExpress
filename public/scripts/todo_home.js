/**
 * Created with JetBrains WebStorm.
 * User: aethe_000
 * Date: 3/17/13
 * Time: 8:03 PM
 * To change this template use File | Settings | File Templates.
 */

var ToDoViewController = {
  markAsComplete: function(itemRef) {
      $.get('./api/todo/complete?ref='+itemRef, function(data) {
         location.reload();
      });
  },
    addItem: function(txt) {
        $.get('./api/todo/new?txt='+txt, function(data) {
            location.reload();
        })
    },

    deleteSingleItem: function(itemRef) {
        $.get('./api/todo/delete?ref='+itemRef, function(data) {
            location.reload();
        });
    },

    cleanItems: function() {
        $.get('./api/todo/clean', function(data) {
            location.reload();
        });
    }
};

$(document).ready(function() {
   $('.todo-item').click(function(e) {
     ToDoViewController.markAsComplete($(e.target).attr('rel'));
   });
   $('#btn-add-item').click(function() {
       ToDoViewController.addItem($('#new-item-text').val());
   });
    $('.btn-delete-item').click(function(e) {
        ToDoViewController.deleteSingleItem($(e.target).attr('rel'));
    });
    $('#btn-clear').click(function() {
        ToDoViewController.cleanItems();
    })
});