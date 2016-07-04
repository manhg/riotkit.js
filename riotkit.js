(function() {
  "use strict";
  var parseJSON = function(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
  var reportException = function(ex) {
    console.log(ex);
  };
  var debug = function(message) {
    console.debug(message)
  };

  define('tag', function() {
    return {
      load: function(resource, require, done) {
        riot.compile(resource, done);
      }
    }
  });

  function BackendMixin() {
    this.extraHeaders = {
      // TODO auth token
      // NOTICE fetch won't send cookie by defaults
    };
    this.fetchGET = function(url, callback) {
      fetch(url, {method: 'GET', headers: this.extraHeaders})
        .then(parseJSON)
        .then(callback)
        .catch(reportException);
    }
    this.fetchPOST = function(url, objData, callback) {
      fetch(url, {
        method: 'POST',
        headers: _.defaults(this.extraHeaders, {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(objData)
      }).then(parseJSON)
        .then(callback)
        .catch(reportException);
    }
    this.formValues = function(formEl, keys) {
      var ret = {},
        el = null;
      for (var i = 0; i < keys.length; i++) {
        el = formEl.querySelector('[name="' + keys[i] + '"]');
        if (el) {
          ret[keys[i]] = el.value;
        } else {
          console.debug('Missing form element: ' + keys[i]);
        }
      }
      el = null;
      return ret;
    }
  };

  riot.mixin('backend', new BackendMixin());

  document.onkeydown = function(e) {
    // Press Escape to close modal
    if (e.keyCode == 27) {
      var mods = document.querySelectorAll('.modal > [type=checkbox]');
      [].forEach.call(mods, function(mod){ mod.checked = false; });
    }
  };
})();
