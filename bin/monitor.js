#!/usr/bin/env node

'use strict';

var server = require('../lib/server');

var port = server.argv.port || 3000;
var util = server.util;

server.run('caffenol-monitor', function() {
  util.log('Runs a web-based monitor for the caffenol queue.');
  util.log();
  util.log('Usage:');
  util.log('  caffenol-monitor');
  util.log();
  util.log('Options:');
  util.log('  -d, --debug           Show extra debug output.');
  util.log('  -h, --help            Show this help and exit.');
  util.log('  -p port, --port=port  Port to use for queue UI.');
  util.log('  -v, --version         Show the version and exit.');
  util.log();
});

server.app.listen(port);
util.log('Started monitor on port', port);
