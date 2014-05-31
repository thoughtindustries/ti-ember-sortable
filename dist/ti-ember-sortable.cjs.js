"use strict";
var idCounter = 0;
function uniqueId() {
  var id = ++idCounter + '';
  return id;
}

var TiEmberSortable = Ember.Component.extend({
  tagName: 'ul',
  contentsBeforeDrop: null,
  handle: '.handle',
  ghostClass: 'sortable-ghost',
  draggableSelector: 'li',

  setupSortable: function() {
    this.destroySortable();
    var list = this.$();

    // assign ids for later detached element matching
    this.$(this.get('draggableSelector')).each(function(i, ele) {
      ele = $(ele);
      if (!ele.attr('id')) {
        ele.attr('id', uniqueId());
      }
    });

    this.set('sortable', new Sortable(list[0], {
      draggable: this.get('draggableSelector'),
      handle: this.get('handle'),
      ghostClass: this.get('ghostClass'),
      onUpdate: Ember.run.bind(this, this.onUpdate)
    }));

    list.on('dragstart', Ember.run.bind(this, this.onDragStart));
  }.on('didInsertElement'),

  onDragStart: function() {
    this.set('contentsBeforeDrop', this.$().children().clone());
  },

  onUpdate: function (evt) {
    if (!this.get('contentsBeforeDrop')) {
      return;
    }

    Ember.run(this, function() {
      var itemElement = $(evt.item),
        newIndex = this.$(this.get('draggableSelector')).index(itemElement),
        items = this.get('items'),
        item;

      // revert changes so the ember-inserted metamorph tags don't get all messed up
      this.$().html(this.get('contentsBeforeDrop'));

      // find the element that was dragged in its old position
      item = items.objectAt(this.$(this.get('draggableSelector')).index($('#' + itemElement.attr('id'))));

      // then apply changes to object instead
      items.removeObject(item);
      items.insertAt(newIndex, item);
      Ember.run.next(this, function() {
        this.setupSortable();
        this.sendAction('action', items, item);
      });
    });
  },

  destroySortable: function() {
    if (this.get('sortable')) {
      this.get('sortable').destroy();
    }
  }.on('willDestroyElement')
});

exports["default"] = TiEmberSortable;