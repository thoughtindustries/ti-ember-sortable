(function(__exports__) {
  "use strict";
  var idCounter = 0;

  function uniqueId() {
    var id = ++idCounter + '';
    return id;
  }

  var TiEmberSortable = Ember.Component.extend({
    tagName: 'ul',
    group: null,
    contentsBeforeDrop: null,
    handle: '.handle',
    ghostClass: 'sortable-ghost',
    draggableSelector: 'li',
    isDisabled: false,
    model: null,
    mutationObserver: null,
    classNameBindings: [
      ':ember-sortable',
      'isDisabled:ember-sortable--disabled:ember-sortable--enabled'
    ],

    setupSortable: function() {
      this.destroySortable();
      var list = this.$();

      this.set(
        'sortable',
        new Sortable(list[0], {
          draggable: this.get('draggableSelector'),
          group: this.get('group') || Math.random(),
          handle: this.get('handle'),
          ghostClass: this.get('ghostClass'),
          onUpdate: Ember.run.bind(this, this.onUpdate)
        })
      );

      this.assignIds();

      list.on('dragstart', Ember.run.bind(this, this.onDragStart));
    }.on('didInsertElement'),

    watchForListChanges: function() {
      var _this = this;

      const observer = new MutationObserver(() => Ember.run.debounce(_this, _this.assignIds, 50));
      observer.observe(this.$()[0], { childList: true });

      this.set('mutationObserver', observer);
    }.on('didInsertElement'),

    // assign ids for later detached element matching
    assignIds: function() {
      if (!this.get('isDestroying') && !this.get('isDestroyed') && this.$) {
        this.$()
          .children(this.get('draggableSelector'))
          .each(function(i, ele) {
            ele = $(ele);
            if (!ele.attr('id')) {
              ele.attr('id', uniqueId());
            }
          });
      }
    },

    onDragStart: function(evt) {
      if (this.get('isDisabled')) {
        evt.preventDefault();
        return false;
      } else {
        this.set(
          'contentsBeforeDrop',
          this.$()
            .children()
            .clone()
        );
      }
    },

    onUpdate: function(evt) {
      if (!this.get('contentsBeforeDrop')) {
        return;
      }

      Ember.run(this, function() {
        var itemElement = $(evt.item),
          newIndex = this.$()
            .children(this.get('draggableSelector'))
            .index(itemElement),
          items = this.get('items'),
          item;

        // revert changes so the ember-inserted metamorph tags don't get all messed up
        this.$().html(this.get('contentsBeforeDrop'));

        // find the element that was dragged in its old position
        item = items.objectAt(
          this.$()
            .children(this.get('draggableSelector'))
            .index($('#' + itemElement.attr('id')))
        );

        // then apply changes to object instead
        items.removeObject(item);
        items.insertAt(newIndex, item);
        Ember.run.next(this, function() {
          if (this.get('model') && this.get('model').one) {
            this.destroySortable();
            this.set('isDisabled', true);
            var eventName = this.get('model.isNew') ? 'didCreate' : 'didUpdate';

            this.get('model').one(eventName, Ember.run.bind(this, this.removeDisabled));
          } else {
            this.setupSortable();
          }

          this.sendAction('action', items, item);
        });
      });
    },

    removeDisabled: function() {
      if (!this.get('isDestroyed')) {
        this.set('isDisabled', false);
        this.setupSortable();
      }
    },

    destroySortable: function() {
      if (this.get('sortable')) {
        try {
          this.get('sortable').destroy();
        } catch (e) {
          // ignore
        }
      }
    }.on('willDestroyElement'),

    destroyMutationObserver: function () {
      const observer = this.get('mutationObserver');
      if (observer) {
        observer.disconnect();
      }
    }.on('willDestroyElement')
  });

  __exports__.TiEmberSortable = TiEmberSortable;
})(window);