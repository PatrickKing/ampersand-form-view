/*$AMPERSAND_VERSION*/
var BBEvents = require('backbone-events-standalone');
var isFunction = require('amp-is-function');
var extend = require('amp-extend');
var result = require('amp-result');
var View = require('ampersand-view')

module.exports = View.extend({

    initialize: function(opts) {

      opts = opts || {};

      this.validCallback = opts.validCallback || this.validCallback || function () {};
      this.submitCallback = opts.submitCallback || this.submitCallback || function () {};

      if (opts.data) this.data = opts.data;
      if (opts.model) this.model = opts.model;

      this.clean = opts.clean || function (res) { return res; };
      this.valid = false;
      this.preventDefault = opts.preventDefault === false ? false : true;

      // storage for our fields
      this._fieldViews = {};
      this._fieldViewsArray = [];

      // add all our fields
      this.render();

      (opts.fields || result(this, 'fields') || []).forEach(this.addField.bind(this));

      this.checkValid(true);

    },

    props: {
      rendered_template: ['boolean', true, false]
    },
    derived: {
        // Overrides ampersand-view
        // We have only rendered if we both have an element, and have populated it with our template
        rendered: {
            deps: ['el', 'rendered_template'],
            fn: function () {
                return !!this.el && this.rendered_template;
            }
        }
    },


    // TODO do I need these?
    data: null,
    // model: null,
    fields: null,

    template: "<form><p>You should pass a template to your AmpersandFormView.</p></form>",

    addField: function (fieldDefinition) {
        var fieldView = fieldDefinition.field_view;

        this._fieldViews[fieldView.name] = fieldView;
        this._fieldViewsArray.push(fieldView);

        fieldView.parent = this;
        fieldView.render();
        var element = this.queryByHook(fieldDefinition.hook);
        element.appendChild(fieldView.el);

    },

    removeField: function (name) {
        var field = this.getField(name);
        if (field) {
            field.remove();
            delete this._fieldViews[name];
            this._fieldViewsArray.splice(this._fieldViewsArray.indexOf(field), 1);
        }
    },

    getField: function (name) {
        return this._fieldViews[name];
    },

    setValid: function (now, forceFire) {
        var prev = this.valid;
        this.valid = now;
        if (prev !== now || forceFire) {
            this.validCallback(now);
        }
    },

    checkValid: function (forceFire) {
        var valid = this._fieldViewsArray.every(function (field) {
            return field.valid;
        });
        this.setValid(valid, forceFire);
        return valid;
    },

    beforeSubmit: function () {
        this._fieldViewsArray.forEach(function (field) {
            if (field.beforeSubmit) field.beforeSubmit();
        });
    },

    update: function (field) {
        this.trigger('change:' + field.name, field);
        // if this one's good check 'em all
        if (field.valid) {
            this.checkValid();
        } else {
            this.setValid(false);
        }
    },

    remove: function () {
        this.el.removeEventListener('submit', this.handleSubmit, false);
        var parent = this.el.parentNode;
        if (parent) parent.removeChild(this.el);
        this._fieldViewsArray.forEach(function (field) {
            field.remove();
        });
    },

    handleSubmit: function (e) {
        this.beforeSubmit();
        this.checkValid();
        if (!this.valid) {
            e.preventDefault();
            return false;
        }

        if (this.preventDefault) {
            e.preventDefault();
            this.submitCallback(this.getData());
            return false;
        }
    },

    getData: function () {
        var res = {};
        for (var key in this._fieldViews) {
            res[key] = this._fieldViews[key].value;
        }
        return this.clean(res);
    },

    reset: function () {
        this._fieldViewsArray.forEach(function (field) {
            if (isFunction(field.reset)) {
                field.reset();
            }
        });
    },

    clear: function () {
        this._fieldViewsArray.forEach(function (field) {
            if (isFunction(field.clear)) {
                field.clear();
            }
        });
    },
    
    render: function () {
        if (this.rendered) return;
        this.renderWithTemplate()

        // if (!this.el) {
        //     this.el = document.createElement('form');
        // }
        // if (this.autoAppend) {
        //     this.fieldContainerEl = this.el.querySelector('[data-hook~=field-container]') || this.el;
        // }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.el.addEventListener('submit', this.handleSubmit, false);
        this.rendered_template = true; // TODO you're sure that this is inherited? 
    }
    
});






