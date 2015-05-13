'use strict';

var chalk = require('chalk');

var util = {
  showDebug: false,
  log: function() {
    console.log.apply(null, arguments);
  },
  error: function() {
    console.log(chalk.red.apply(null, arguments));
  },
  warn: function() {
    console.log(chalk.yellow.apply(null, arguments));
  },
  debug: function() {
    if (showDebug) {
      console.log.apply(null, arguments);
    }
  }
};

module.exports = util;
