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

            let cleanStdErr = cleanErr(stderr);
            if (cleanStdErr) {
                reject({ error: cleanStdErr, out: stdout });
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

function cleanErr(stderr) {
    return (stderr || '').split('\n')
        .filter(x => x.replace(' ', '').replace('\r', '').length > 0) //clean empty strings
        .filter(x => !x.startsWith('npm WARN')) //clean npm warnings;
        .join('\n');
}

async function build() {
    try {
        await runBuildStep('Fixing style...', 'lint_fix');
        await runBuildStep('Linting...', 'lint');
        await runBuildStep('Building server...', 'build_server');
        await runBuildStep('Building client...', 'build_client');
    } catch (err) {
        process.stdout.write("error\n");
        if (err.out) {
            console.error('STDOUT:');
            console.error(err.out.toString());
        }
        console.error('STDERR:');
        console.error(err.error.toString());
        process.exit(1);
    }
}

build();
