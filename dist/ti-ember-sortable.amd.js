define("ti-ember-sortable",
  ["exports"],
  function(__exports__) {
    "use strict";
    var TiEmberSortable = Ember.Component.extend({
      tagName: 'ul',
      contentsBeforeDrop: null,
      handle: '.handle',
      ghostClass: 'sortable-ghost',

      setupSortable: function() {
        this.destroySortable();
        var list = this.$();

        this.set('sortable', new Sortable(list[0], {
          draggable: 'li',
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
            parent = itemElement.parent(),
            newIndex = parent.find('li').index(itemElement),
            items = this.get('items'),
            item;

          // revert changes so the ember-inserted metamorph tags don't get all messed up
          this.$().html(this.get('contentsBeforeDrop'));

          // find the element that was dragged in its old position
          item =  items.objectAt(parent.find('li').index($('#' + itemElement.attr('id'))));

          // then apply changes to object instead
          items.removeObject(item);
          items.insertAt(newIndex, item);
          this.setupSortable();
          this.sendAction('action', items, item);
        });
      },

      destroySortable: function() {
        if (this.get('sortable')) {
          this.get('sortable').destroy();
        }
      }.on('willDestroyElement')
    });

    __exports__["default"] = TiEmberSortable;
  });