const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function gitPush(remoteUrl) {
    const gitDir = path.resolve(process.cwd(), '.git');

    // Run the git push command using child_process
    try {
        execSync(`git -C ${gitDir} push ${remoteUrl} master`, { stdio: 'inherit' });
        console.log(`Pushed to ${remoteUrl}`);
    } catch (error) {
        console.error('Error pushing to remote:', error);
    }
}

module.exports = gitPush;
