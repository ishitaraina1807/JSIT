const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Get the path to the .git directory
function getGitDir() {
  return path.join(process.cwd(), '.git');
}

// Ensure .git folder and subdirectories exist
function ensureGitDir() {
  const gitDir = getGitDir();

  if (!fs.existsSync(gitDir)) {
    console.log('.git directory is missing. Run git init first.');
    process.exit(1);
  }

  return gitDir;
}

// Utility to hash content (similar to Git's SHA-1 hash for objects)
function hashContent(content) {
  return crypto.createHash('sha1').update(content).digest('hex');
}

// Function to write object files into .git/objects/
function writeObject(content) {
  const hash = hashContent(content);
  const objectDir = path.join(getGitDir(), 'objects', hash.slice(0, 2));
  const objectPath = path.join(objectDir, hash.slice(2));

  if (!fs.existsSync(objectDir)) {
    fs.mkdirSync(objectDir);
  }

  fs.writeFileSync(objectPath, content);
  return hash;
}

// Function to read object files from .git/objects/
function readObject(hash) {
  const objectDir = path.join(getGitDir(), 'objects', hash.slice(0, 2));
  const objectPath = path.join(objectDir, hash.slice(2));

  if (!fs.existsSync(objectPath)) {
    console.log('Object not found:', hash);
    return null;
  }

  return fs.readFileSync(objectPath, 'utf-8');
}

// Example function for staging a file (git add)
function stageFile(filePath) {
  ensureGitDir();

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const fileHash = writeObject(fileContent);

  console.log(`Staged file ${filePath} with hash ${fileHash}`);
  return fileHash;
}

// Example function for committing (git commit)
function commit(message) {
  ensureGitDir();

  const commitContent = `commit ${message}`;
  const commitHash = writeObject(commitContent);

  const headPath = path.join(getGitDir(), 'HEAD');
  const headContent = `ref: refs/heads/master\n`;

  if (!fs.existsSync(path.dirname(headPath))) {
    fs.mkdirSync(path.dirname(headPath), { recursive: true });
  }

  fs.writeFileSync(headPath, headContent);

  console.log(`Created commit with message: "${message}" and hash: ${commitHash}`);
}

// Export functions
module.exports = {
  getGitDir,
  hashContent,
  writeObject,
  readObject,
  stageFile,
  commit
};
