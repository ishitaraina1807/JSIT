// src/index.js
const gitInit = require('./commands/init');
const gitAdd = require('./commands/add');
const gitCommit = require('./commands/commit');

// Simple command-line interface for now
const command = process.argv[2];
const filePath = process.argv[3];

if (command === 'init') {
  gitInit();
} else if (command === 'add') {
  gitAdd(filePath);
} else if (command === 'commit') {
  gitCommit();
} else {
  console.log('Unknown command');
}
