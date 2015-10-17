#!/usr/bin/env node

'use strict';

/**
 * Base module for caffenol queue servers. This is used for individual job
 * processing servers as well as the web-based monitoring server.
 */

var chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));
var kue = require('kue');
var cliPackage = require('../package');
var util = require('./util');

util.showDebug = argv.d || argv.debug;
var versionFlag = argv.v || argv.version;
var helpFlag = argv.h || argv.help;
var queue = kue.createQueue();

module.exports = {
  run: function(name, help) {
    if (versionFlag) {
      util.log(
        name.substring(0, 1).toUpperCase() + name.substring(1),
        'CLI version',
        cliPackage.version
      );
      process.exit(0);
    }

    if (helpFlag) {
      help();
      process.exit(0);
    }

    process.once('SIGINT', function() {
      if (queue.client.connected) {
        queue.shutdown(5000, function(err) {
          if (err) {
            util.error('Shutdown with error', err);
            process.exit(1);
          } else {
            util.log('Good bye!');
            process.exit(0);
          }
        });
      } else {
        util.log('Good bye!');
        process.exit(0);
      }
    });

    queue.on('error', function(err) {
      if (/ECONNREFUSED/.test(err.message)) {
        util.error(chalk.red(err.message));
        process.exit(1);
      } else {
        util.error(chalk.red(err.message));
      }
    });
  },
  queue: queue,
  app: kue.app,
  util: util,
  argv: argv,
};
