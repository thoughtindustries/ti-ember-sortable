ti-ember-sortable
==============

Sortable lists for Ember.js.

![Sortable Example](https://cloud.githubusercontent.com/assets/44855/3088265/d46da0e6-e56b-11e3-8649-dc7f9b45bc5a.gif)

Usage
-----

Simply include the `ti-sortable-list.{amd,cjs,global}.js` file your in favorite asset pipeline, or use bower, or copy/paste, or whatever you like.

Then, just use the component:

```handlebars
{{#ti-sortable-list items=links class="items__list" action="save"}}
  {{#each link in links}}
	<li>
      <i class="handle">Move</i>
      {{input value=link.label}}
    </li>
  {{/each}}
{{/ti-sortable-list}}
```

Rationale
---------

There are a lot of list sorting libraries out there. Most of them blow up with Ember.js due to the metamorph script tags Ember adds to DOM for databinding:

![Lots of script tags](https://cloud.githubusercontent.com/assets/44855/3088266/da60dec8-e56b-11e3-9329-17fd66411607.jpg)

When you use most of the list sorting libraries out there, the list ends up looking like so:

![Mangled script tags](https://cloud.githubusercontent.com/assets/44855/3088268/dc8217bc-e56b-11e3-8b1a-8df39515119b.jpg)

We do some fancy legwork to remove and reattach correctly, ensuring databinding works great post-sort, but really all the heavy lifting is done by [Sortable](https://github.com/RubaXa/Sortable).

TODO
----

Tests!
