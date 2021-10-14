const core = require('@actions/core');
const io = require('@actions/io');
const { getExecOutput } = require('@actions/exec');

const stringArgv = require('string-argv');

async function run() {
  core.debug("Starting executable-wrapper")

  const runCommand = core.getInput('run_command', { required: true });
  core.debug(`Parameter - run_command: \'${runCommand}\'`);

  args = stringArgv.parseArgsStringToArgv(runCommand);
  command = args[0];
  args = args.slice(1);

  const options = {
    ignoreReturnCode: true
  };

  // Check that the command exists
  io.which(command, true);

  const output = await getExecOutput(command, args, options);

  core.debug(`Program exited with code ${output.exitCode}.`);
  core.debug(`stdout: ${output.stdout}`);
  core.debug(`stderr: ${output.stderr}`);
  core.debug(`exitcode: ${output.exitCode}`);

  core.setOutput('stdout', output.stdout);
  core.setOutput('stderr', output.stderr);
  core.setOutput('exitcode', output.exitCode);

  if (output.exitCode !== 0) {
    core.setFailed(`Program exited with code ${output.exitCode}.`);
  }
}

module.exports = run;