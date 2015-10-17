#!/usr/bin/env node

'use strict';

var chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));
var kue = require('kue');
var cliPackage = require('../package');
var util = require('../lib/util');

util.showDebug = argv.d || argv.debug;
var versionFlag = argv.v || argv.version;
var port = argv.port || 3000;
var helpFlag = argv.h || argv.help;

if (versionFlag) {
  var name = cliPackage.name;
  util.log(
    name.substring(0, 1).toUpperCase() + name.substring(1),
    'CLI version',
    cliPackage.version
  );
  process.exit(0);
}

if (helpFlag) {
  util.log(cliPackage.description);
  util.log();
  util.log('Usage:');
  util.log('  ', cliPackage.name);
  util.log();
  util.log('Options:');
  util.log('  -d, --debug           Show extra debug output.');
  util.log('  -h, --help            Show this help and exit.');
  util.log('  -p port, --port=port  Port to use for queue UI.');
  util.log('  -v, --version         Show the version and exit.');
  util.log();
  process.exit(0);
}

var queue = kue.createQueue();

/**
 * Maximum number of jobs that will be dequeued from Redis in a single
 * operation. Jobs are not processed concurrently because node.js is single-
 * threaded.
 */
var concurrentJobs = 4;

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

queue.process('process-photo', concurrentJobs, function(job, done) {
  util.debug('Got a job!');
  console.dir(job.data);
  util.debug('Job done');
  done();
});

kue.app.listen(port);
util.log('Started on port', port);
