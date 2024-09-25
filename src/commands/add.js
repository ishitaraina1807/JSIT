// src/commands/add.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashFile(content) {
  return crypto.createHash('sha1').update(content).digest('hex');
}

function gitAdd(filePath) {
  const gitDir = path.join(process.cwd(), '.git');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const fileHash = hashFile(fileContent);
  
  const objectDir = path.join(gitDir, 'objects', fileHash.slice(0, 2));
  const objectPath = path.join(objectDir, fileHash.slice(2));
  
  if (!fs.existsSync(objectDir)) {
    fs.mkdirSync(objectDir);
  }
  
  fs.writeFileSync(objectPath, fileContent);
  console.log(`Added file: ${filePath}`);
}

module.exports = gitAdd;
