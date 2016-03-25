var postcss = require('postcss');

module.exports = postcss.plugin('postcss-nsbuilder', function (opts) {
  function cache(func) {
    var dump = !('cache' in func) ? func.cache = {} : func.cache;
    return function() {
      var key = JSON.stringify(Array.prototype.slice.call(arguments));
      for(var i in dump) if(i === key) return dump[key];
      return dump[key] = func.apply(this, arguments);
    }
  }

  function separateBy(x, string) {
    if(x !== 'cc') return string.split(new RegExp("\S*" + x + "\S*"));
    return string.replace( /([a-z])([A-Z])/g, '$1,$2' ).split(',');
  }

  function getName(type, string) {
    var start = type.length + 2; // symbols : and (
    var end = string.length + 1; // symbol )
    return string.substring(start, end).replace(/[^-_0-9a-z]/gi, '');
  }

  function getType(str) {
    return ~str.indexOf(':model') ? 'model' :
           ~str.indexOf(':has') ? 'has' :
           ~str.indexOf(':is') ? 'is' : false;
  }

  function getAbbr(val) {
    var result = "";
    separateBy('-', val).forEach(function(val) {
      separateBy('_', val).forEach(function(val) {
        separateBy('cc', val).forEach(function(val) {
          result += val.slice(0, 1);
        })
      })
    });
    return result;
  }

  return function (css, result) {
    var cachedAbbr = cache(getAbbr);
    var cachedType = cache(getType);
    var cachedName = cache(getName);

    css.walkRules(/:model|:has|:is/, function (rule) {
      var selector = rule.selector;
      var matches = selector.match(/:model\(.+?\)|:has\(.+?\)|:is\(.+?\)/igm);
      var prefix = cachedAbbr( cachedName('model',
        matches.filter(function(val) {
          return cachedType(val) == 'model';
        }).shift())).toLowerCase();

      matches.forEach(function(val) {
        var type = cachedType(val);
        var name = cachedName(type, val.toLowerCase());
        var echo = ".";

        if(type == 'model') echo += name;
        if(type == 'has') echo += prefix + '-' + name;
        if(type == 'is') echo += prefix + '_' + name;
        selector = selector.replace(val, echo);
      });

      rule.selector = selector;
    });
  }
});
