/**
 * @file This script returns errorlevel 0 if version is published in the repository or 1 if not
 */
const { exec } = require('child_process');

if (!process.argv[2]) {
    console.error('No module name passed');
    process.exit(2);
}
if (!process.argv[3]) {
    console.error('No expected version was passed');
    process.exit(2);
}
exec(`npm view --json ${process.argv[2]}`, (err, stdout, stderr) => {
    if (stderr) {
        console.error('No such package in repository');
        process.exit(2);
    }
    const result = JSON.parse(stdout);
    process.exit(
        result.versions.some(current => current === process.argv[3])
            ? 0
            : 1
    );
});