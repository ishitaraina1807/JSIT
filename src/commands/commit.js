const fs = require('fs');
const path = require('path');
const { hashString } = require('../utils');

function gitCommit(author, message) {
    const gitDir = path.resolve(process.cwd(), '.git');
    const indexPath = path.join(gitDir, 'index');

    // Read the index file
    let index = {};
    if (fs.existsSync(indexPath)) {
        index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    }

    // Check if there are changes to commit
    if (Object.keys(index).length === 0) {
        console.log("No changes to commit.");
        return;
    }

    // Create a commit object
    console.log(`Author: ${author}, Message: ${message}`);
    const commit = {
        author,
        message,
        timestamp: new Date().toISOString(),
        changes: index,
    };

    // Save the commit to the commits log (commits.json)
    const commitsPath = path.join(gitDir, 'commits.json');
    const commits = fs.existsSync(commitsPath) ? JSON.parse(fs.readFileSync(commitsPath, 'utf-8')) : [];
    commits.push(commit);
    fs.writeFileSync(commitsPath, JSON.stringify(commits, null, 2));

    console.log(`Committed changes: ${message}`); // This should show the correct message
}

module.exports = gitCommit;
