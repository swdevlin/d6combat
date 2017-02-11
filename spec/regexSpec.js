var regexEscape = require('../regexescaper');

describe("regex Escaper suite", function() {
  it('escapeTest', function() {
    var escaped = regexEscape('a');
    expect(escaped).toBe('a');

    escaped = regexEscape('"');
    expect(escaped).toBe('"');

    escaped = regexEscape('\\s');
    expect(escaped).toBe('\\\\s');

    var shouldBeEscaped = '[-[]{}()*+?.,\\^$|#';
    for (var i = 0; i < shouldBeEscaped.length; i++) {
      var c = shouldBeEscaped[i];
      escaped = regexEscape(c);
      expect(escaped).toBe('\\' + c);
    }
  });

});
