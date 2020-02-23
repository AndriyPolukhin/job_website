/**
 * CRON worker to fetch Jobs from an API
 */

// * Dependencies
const CronJob = require("cron").CronJob;
const fetchGithub = require("./tasks/fetch-github");
// * Cron Job
const job = new CronJob(
  "*/1 * * * *",
  fetchGithub,
  null,
  true,
  "America/Los_Angeles"
);
// * Start the Job
job.start();
