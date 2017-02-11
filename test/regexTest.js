var assert = require('assert');
var regexEscape = require('../regexescaper');

describe('regex test suite', function() {
  describe('escaping', function() {
    it('not escaped', function() {
      var escaped = regexEscape('a');
      assert.equal('a', escaped);

      escaped = regexEscape('"');
      assert.equal('"', escaped);
    });

    it('escaped', function() {
      var escaped = regexEscape('\\s');
      assert.equal('\\\\s', escaped);

      var shouldBeEscaped = '[-[]{}()*+?.,\\^$|#';
      for (var i = 0; i < shouldBeEscaped.length; i++) {
        var c = shouldBeEscaped[i];
        escaped = regexEscape(c);
        assert.equal('\\' +c, escaped);
      }
    });
  });
});
