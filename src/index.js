const init = require('./commands/init');
const add = require('./commands/add');
const gitCommit = require('./commands/commit');
const gitPush = require('./commands/push'); // Import the push function

const args = process.argv.slice(2);

// Command logic based on args
if (args[0] === 'init') {
    init();
} else if (args[0] === 'add') {
    add(args[1]);
} else if (args[0] === 'commit') {
    const author = args[1];
    const message = args[2];
    gitCommit(author, message);
} else if (args[0] === 'push') {
    const remoteUrl = args[1]; // Get the remote URL from the command line
    gitPush(remoteUrl); // Call the push function
} else {
    console.log('Unknown command');
}
