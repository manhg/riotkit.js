(function() {
  "use strict";

  /**
   * AMD load Riot tag file
   * example: require('tag!/path/to/some.tag', function() { // tag loaded })
   */
  define('tag', function() {
    return {
      load: function(resource, require, done) {
        riot.compile(resource, done);
      }
    }
  });

  function UtilsMixin() {
    /** Parse JSON response and pass status to Promise chain */
    var parse = function(response) {
      return new Promise(function(accept, reject) {
        response.json().then(function(json) {
          if (response.status >= 200 && response.status < 300) {
            accept(json, response.status)
          } else {
            reject(json, response.status)
          }
        });
      });
    };
    this.fetch = {};

    /** Get JSON */
    this.fetch.get = function(url) {
      return fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json'
        }
      }).then(parse)
    };

    /**
     * Send JSON data
     * @param {Object} data
     */
    this.fetch.send = function(url, data, method) {
      return fetch(url, {
        method: method || 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(parse)
    };

    /**
     * Post encoded form
     * @param {Object} data
     */
    this.fetch.form = function(url, formNode) {
      return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        body: new FormData(formNode)
      }).then(parse)
    };

    /**
     * Given a form, return object contains all its data
     * @param {HTMLFormElement} formNode
     */
    this.serialize = function(formNode) {
      var ret = {}, item = null;
      for (var i = 0; i < formNode.elements.length; i++) {
        item = formNode.elements[i];
        if (item.nodeName == 'INPUT') {
          if (item.type == 'checkbox' || item.type == 'radio') {
            if (item.checked) {
              ret[item.name] = item.value;
            }
          }
          else if (item.type == 'file') { }
          else {
            ret[item.name] = item.value;
          }
        } else if (item.nodeName == 'SELECT') {
          if (item.hasAttribute('multiple')) {
            ret[item.name] = [];
            for (var j = iten.options.length - 1; j >= 0; j--) {
              if (item.options[j].selected) {
                ret[item.name].push(item.options[j].value)
              }
            }
          } else {
            ret[item.name] = item.value;
          }
        } else if (item.nodeName == 'TEXTAREA') {
          ret[item.name] = item.value;
          // TODO case 'SELECT':
          // https://github.com/riverside/form-serialize/blob/master/serialize.js#L34
        }
      }
      item = null;
      return ret;
    }
  };

  riot.mixin('utils', new UtilsMixin());
})();
