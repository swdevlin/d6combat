var reporters = require('jasmine-reporters');
var terminalReporter = new reporters.TerminalReporter({
  verbosity: 1,
  color: true,
  showStack: false
});
jasmine.getEnv().addReporter(terminalReporter);
