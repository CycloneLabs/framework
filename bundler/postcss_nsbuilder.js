var postcss = require('postcss');

module.exports = postcss.plugin('postcss-nsbuilder', function (opts) {

  function clean(string) {
    return string.replace(/[^-_0-9a-z]/gi, '');
  }

  function get(type, string) {
    var startPos = type.length + 2; // symbols : and (
    var endPos = string.length + 1; // symbol )
    return clean(string.substring(startPos, endPos));
  }

  function separate(string, separator) {
    return string.split(new RegExp("\S*" + separator + "\S*"));
  }

  function separateCamelCase(string) {
    return string.replace( /([a-z])([A-Z])/g, '$1,$2' ).split(',');
  }

  function abbr(string) {
    var separatedByDash = separate(string, '-'), result = '', i = 0;
    while(i < separatedByDash.length) {
      var separatedByUnderscore = separate(separatedByDash[i++], '_'), j = 0;
      while(j < separatedByUnderscore.length) {
        var separatedByCamelCase = separateCamelCase(separatedByUnderscore[j++]), k = 0;
        while(k < separatedByCamelCase.length) {
          result += separatedByCamelCase[k++].slice(0, 1);
        }
      }
    }
    return result;
  }

  return function (css, result) {
    css.walkRules(/:model|:has|:which/, function (rule) {
      var matches = rule.selector.match(/:model\(.+?\)|:has\(.+?\)|:which\(.+?\)/igm);
      var currentModule = matches.filter(function(item) { return !!~item.indexOf(':model') })[0];
      var updatedSelector = rule.selector, name;
      var prefix = abbr( get('model', currentModule) );

      for(matchesCounter = matches.length; matchesCounter--;) {
        switch (true) {
          case !!~matches[matchesCounter].indexOf(':model'):
            name = '.' + get('model', matches[matchesCounter])
            break
          case !!~matches[matchesCounter].indexOf(':has'):
            name = '.' + prefix + '-' + get('has', matches[matchesCounter]);
            break
          case !!~matches[matchesCounter].indexOf(':which'):
            name = '.' + prefix + '_' + get('which', matches[matchesCounter])
            break
        }
        updatedSelector = updatedSelector.replace(matches[matchesCounter], name.toLowerCase());
      }

      rule.selector = updatedSelector;
    });
  }
});
