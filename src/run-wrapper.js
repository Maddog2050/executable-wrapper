const core = require('@actions/core');
const io = require('@actions/io');
const { exec } = require('@actions/exec');

const OutputListener = require('./lib/output-listener');

const stringArgv = require('string-argv');

async function run() {
  core.debug("Starting executable-wrapper")

  const runCommand = core.getInput('run_command', { required: true });
  core.debug(`Parameter - run_command: \'${runCommand}\'`);

  args = stringArgv.parseArgsStringToArgv(runCommand);
  command = args[0];
  args = args.slice(1);

  // Create listeners to receive output (in memory) as well
  const stdout = new OutputListener();
  const stderr = new OutputListener();
  const listeners = {
    stdout: stdout.listener,
    stderr: stderr.listener
  };

  const options = {
    listeners,
    ignoreReturnCode: true
  };

  // Check that the command exists
  io.which(command, true);

  const exitCode = await exec(command, args, options);

  core.debug(`Program exited with code ${exitCode}.`);
  core.debug(`stdout: ${stdout.contents}`);
  core.debug(`stderr: ${stderr.contents}`);
  core.debug(`exitcode: ${exitCode}`);

  core.setOutput('stdout', stdout.contents);
  core.setOutput('stderr', stderr.contents);
  core.setOutput('exitcode', exitCode.toString(10));

  if (exitCode !== 0) {
    core.setFailed(`Program exited with code ${exitCode}.`);
  }
}

module.exports = run;