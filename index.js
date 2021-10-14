const core = require('@actions/core');
const runWrapper = require('./src/run-wrapper');

(async () => {
  try {
    await runWrapper();
  } catch (error) {
    core.setFailed(error.message);
  }
})();