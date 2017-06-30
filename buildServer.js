const exec = require('child_process').exec;

async function runNpmCommand(command) {
    //const { stdout, stderr } = await exec(`npm run ${command}`);
    return new Promise((resolve, reject) => {
        const start = process.hrtime();
        exec(`npm run ${command}`, (error, stdout, stderr) => {
            if (error) {
                reject({ error: stderr, out: stdout });
                return;
            }

            if (stderr) {
                reject({ error: stderr, out: stdout });
                return;
            }

            const elapsed = process.hrtime(start);
            resolve({ out: stdout, time: elapsed });
        });
    });
}

async function runBuildStep(comment, command) {
    process.stdout.write(comment);
    const result = await runNpmCommand(command);
    process.stdout.write(`done (${formatTime(result.time)})\n`);
    return result;
}

function formatTime(time) {
    const seconds = time[0];
    const min = Math.trunc(seconds / 60);
    const secondsLeft = seconds - min * 60;
    return `${min}m ${secondsLeft}s`;
}

async function build() {
    try {
        await runBuildStep('Fixing style...', 'lint_fix');
        await runBuildStep('Linting...', 'lint');
        await runBuildStep('Compiling...', 'compile');
        await runBuildStep('Testing...', 'test');
    } catch (err) {
        process.stdout.write("error\n");
        if (err.out) {
            console.error('STDOUT:');
            console.error(err.out.toString());
        }
        console.error('STDERR:');
        console.error(err.error.toString());
    }
}

build();
