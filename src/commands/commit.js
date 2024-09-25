const fs = require('fs');
const path = require('path');
const { hashContent, writeFile, readFile, getCurrentTimestamp, formatCommit } = require('./utils');

// Define .git directory path
const GIT_DIR = path.join(process.cwd(), '.git');
const INDEX_PATH = path.join(GIT_DIR, 'index');
const HEAD_PATH = path.join(GIT_DIR, 'HEAD');
const OBJECTS_DIR = path.join(GIT_DIR, 'objects');

// Function to create a commit
function commit(author, message) {
    // Step 1: Get staged files from the index
    const stagedFiles = getStagedFiles();
    if (!stagedFiles.length) {
        console.error("No files staged for commit.");
        return;
    }

    // Step 2: Create a tree object from the staged files
    const treeHash = createTreeObject(stagedFiles);

    // Step 3: Get the current commit (if any) from HEAD
    const parentCommit = getCurrentCommitHash();

    // Step 4: Generate commit object content
    const commitContent = generateCommitObjectContent(treeHash, parentCommit, author, message);

    // Step 5: Hash and store the commit object
    const commitHash = storeObject(commitContent);

    // Step 6: Update HEAD to point to the new commit
    updateHEAD(commitHash);

    console.log(`Created commit ${commitHash}`);
}

// Get staged files from index
function getStagedFiles() {
    if (!fs.existsSync(INDEX_PATH)) {
        return [];
    }
    const indexContent = readFile(INDEX_PATH);
    // Assuming the index format is a simple file list (you may need to parse it depending on your implementation)
    return indexContent.split('\n').filter(file => file);
}

// Create a tree object from staged files
function createTreeObject(stagedFiles) {
    let treeContent = '';
    stagedFiles.forEach(file => {
        const fileContent = readFile(file);
        const fileHash = hashContent(fileContent);
        const fileMode = '100644'; // Regular file
        const fileName = path.basename(file);
        treeContent += `${fileMode} ${fileName}\0${Buffer.from(fileHash, 'hex')}`;
    });
    return storeObject(treeContent);
}

// Generate the content of the commit object
function generateCommitObjectContent(treeHash, parentCommit, author, message) {
    let commitContent = '';
    commitContent += `tree ${treeHash}\n`;
    if (parentCommit) {
        commitContent += `parent ${parentCommit}\n`;
    }
    commitContent += `author ${author} ${getCurrentTimestamp()}\n`;
    commitContent += `committer ${author} ${getCurrentTimestamp()}\n\n`;
    commitContent += `${message}\n`;
    return commitContent;
}

// Store a Git object and return its hash
function storeObject(content) {
    const contentHash = hashContent(content);
    const objectDir = path.join(OBJECTS_DIR, contentHash.substring(0, 2));
    const objectFile = path.join(objectDir, contentHash.substring(2));

    ensureDir(objectDir);

    // Write object to the file, compress it (simulating Git compression)
    writeFile(objectFile, zlib.deflateSync(content));

    return contentHash;
}

// Retrieve the current commit hash from HEAD
function getCurrentCommitHash() {
    if (!fs.existsSync(HEAD_PATH)) {
        return null;
    }
    const ref = readFile(HEAD_PATH).trim();
    if (ref.startsWith('ref: ')) {
        const refPath = path.join(GIT_DIR, ref.split(' ')[1]);
        return readFile(refPath).trim();
    } else {
        return ref; // Detached HEAD state
    }
}

// Update HEAD to point to the new commit
function updateHEAD(commitHash) {
    const ref = readFile(HEAD_PATH).trim();
    if (ref.startsWith('ref: ')) {
        const refPath = path.join(GIT_DIR, ref.split(' ')[1]);
        writeFile(refPath, commitHash);
    } else {
        // Detached HEAD state: directly update HEAD with the new commit hash
        writeFile(HEAD_PATH, commitHash);
    }
}

module.exports = {
    commit
};
