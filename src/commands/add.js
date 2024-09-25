const fs = require('fs');
const path = require('path');
const { hashString } = require('../utils'); // Ensure this is correct

function add(filePath) {
    const gitDir = path.resolve(process.cwd(), '.git');
    const indexPath = path.join(gitDir, 'index');

    // Check if the index file exists
    let index = {};
    if (fs.existsSync(indexPath)) {
        index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    }

    // Read the file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Hash the file content
    const fileHash = hashString(fileContent); // This line should work now

    // Update the index with the new file
    index[filePath] = fileHash;

    // Write the updated index back to the file
    fs.writeFileSync(indexPath, JSON.stringify(index));

    console.log(`Added file: ${filePath}`);
}

module.exports = add;
