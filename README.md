# ampersand-form-view

This is a fork of <a href="https://github.com/AmpersandJS/ampersand-form-view"> ampersand-form-view</a> that has been altered to accept a template parameter, and to render input views within the template. 


Here are the most important differences with the current `ampersand-form-view`:

- Previously, `ampersand-form-view` did not actually inherit from `ampersand-view`, it just implemented the <a href="http://ampersandjs.com/learn/view-conventions">conventions<a> established for views in Ampersand. This version does inherit from `ampersand-view`, so that we can make use of `renderWithTemplate()`.
- Because we inherit from `ampersand-view` and use the `initialize()` hook it provides, if you want to use `initialize()` in your own descendent of this view you need to call the base class' `initialize`. You can do that like:

```javascript
FormView = require('./ampersand-form-view')

FormView.extend({
  initialize: function(){
    FormView.prototype.initialize.call(this, arguments)
    // ... Your initialization code here
  }
})
```  
- The format for passing in fields has changed. Instead of just passing a list of `ampersand-input-view` compatible views, you now pass a little object with a view and with a hook. The view gets rendered under the element in your template with the hook. You can use strings or functions as templates as usual, letting you separate out the overall design of your form from that of your inputs.

```javascript
FormView = require('./ampersand-form-view')

FormView.extend({
    template: "<div data-hook='my-excellent-input'></div>",
    fields: [
                hook: 'my-excellent-input',
                field_view: new InputView({
                    // ... 
                })
            ]
})
```

- The original form view had an 'autoappend' setting. This is gone.
- It's not on NPM yet.
- It might be full of bugs, because I'm pretty new to Ampersand!


## todos
- Test more
- Integrate this with mainline Ampersand? It would be nice if we could roll the `hook` property into `ampersand-input-view`.
- I only realized that <a href="http://ampersandjs.com/docs#ampersand-view-registersubview"> subviews </a> exist recently, should this take advantage of that?


## credits

Alterations by PatrickKing
Created by [@HenrikJoreteg](http://twitter.com/henrikjoreteg)



## license

MIT

