const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Ensure directory exists, if not create it
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Write data to a file
function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

// Read data from a file
function readFile(filePath) {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  } else {
    console.error(`File not found: ${filePath}`);
    return null;
  }
}

// Hash content using SHA-1 (similar to Git)
function hashContent(content) {
  return crypto.createHash('sha1').update(content).digest('hex');
}

// Create or append to a log file
function logToFile(filePath, message) {
  fs.appendFileSync(filePath, message + '\n');
}

// Format Git commit metadata (author, date, message)
function formatCommit(author, date, message) {
  return `Author: ${author}\nDate: ${date}\n\n    ${message}`;
}

// Generate the current timestamp for Git commits
function getCurrentTimestamp() {
  return new Date().toISOString();
}

// Utility to check if a file is being tracked by Git
function isFileTracked(filePath) {
  const gitDir = path.join(process.cwd(), '.git');
  const indexPath = path.join(gitDir, 'index');
  
  if (fs.existsSync(indexPath)) {
    const indexContent = readFile(indexPath);
    return indexContent.includes(filePath);
  }
  return false;
}

module.exports = {
  ensureDir,
  writeFile,
  readFile,
  hashContent,
  logToFile,
  formatCommit,
  getCurrentTimestamp,
  isFileTracked
};
