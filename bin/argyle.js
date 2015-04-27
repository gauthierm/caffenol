#!/usr/bin/env node

'use strict';

var chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));
var kue = require('kue');
