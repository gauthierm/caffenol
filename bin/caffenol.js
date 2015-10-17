#!/usr/bin/env node

'use strict';

var server = require('../lib/server');
var cliPackage = require('../package');

var util = server.util;
var queue = server.queue;

server.run(cliPackage.name, function() {
  util.log(cliPackage.description);
  util.log();
  util.log('Usage:');
  util.log('  ', cliPackage.name);
  util.log();
  util.log('Options:');
  util.log('  -d, --debug    Show extra debug output.');
  util.log('  -h, --help     Show this help and exit.');
  util.log('  -v, --version  Show the version and exit.');
  util.log();
});

/**
 * Maximum number of jobs that will be dequeued from Redis in a single
 * operation. Jobs are not processed concurrently because node.js is single-
 * threaded.
 */
var concurrentJobs = 4;

queue.process('process-photo', concurrentJobs, function(job, done) {
  util.debug('=> starting photo-process job!');
  util.debug('=>', job.data.title);
  setTimeout(function() {
    util.debug('=> photo-process done');
    util.debug();
    done();
  }, 5000);
});

util.debug('Ready for work!');
