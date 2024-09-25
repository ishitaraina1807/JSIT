// src/commands/init.js
const fs = require('fs');
const path = require('path');

function gitInit() {
  const gitDir = path.join(process.cwd(), '.git');
  
  if (!fs.existsSync(gitDir)) {
    fs.mkdirSync(gitDir);
    fs.mkdirSync(path.join(gitDir, 'objects')); // Store objects
    fs.mkdirSync(path.join(gitDir, 'refs'));    // Store refs (branches)
    fs.writeFileSync(path.join(gitDir, 'HEAD'), 'ref: refs/heads/master\n');
    console.log('Initialized empty Git repository');
  } else {
    console.log('.git directory already exists.');
  }
}

module.exports = gitInit;
