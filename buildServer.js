const execSync = require('child_process').execSync;

process.stdout.write("Fixing style...");
execSync('npm run lint_fix');
process.stdout.write("done\n");
process.stdout.write("Linting...");
execSync('npm run lint');
process.stdout.write("done\n");
process.stdout.write("Compiling...");
execSync('npm run compile');
process.stdout.write("done\n");
