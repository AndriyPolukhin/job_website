/**
 * @fn to retrieve the Jobs from an Github API
 */
// * Dependencies
const fetch = require("node-fetch");
const redis = require("redis");
const client = redis.createClient();

// * Promisify Redis
const { promisify } = require("util");
const setAsync = promisify(client.set).bind(client);

// * Set the base url
const baseUrl = "https://jobs.github.com/positions.json";

// * @fn to fetch data from github api
const fetchGithub = async () => {
  console.log(`fetching github:`);
  // * Iterators
  let resultCount = 1;
  let onPage = 0;

  // * Array for all jobs
  const allJobs = [];

  // * Fetch all pages by: Loop over the pages to collect jobs in allJobs
  while (resultCount > 0) {
    // * Make a fetch request
    const jobs = await fetch(`${baseUrl}?page=${onPage}`)
      .then(res => res.json())
      .then(json => json)
      .catch(err => console.log((err && err.stack) || err));

    // * Push the jobs
    allJobs.push(...jobs);
    // * update the page
    onPage++;

    // * temp check in console
    resultCount = jobs.length;
    console.log("got", resultCount, "jobs");
  }
  // * Total Jobs
  console.log("got", allJobs.length, "jobs total");

  // * Filter Algorithm for JR Dev Jobs
  const jrJobs = allJobs.filter(job => {
    // * Lowercase the title
    const jobTitle = job.title.toLowerCase();

    // * Logic :: condition to return false
    if (
      jobTitle.includes(`senior`) ||
      jobTitle.includes(`manager`) ||
      jobTitle.includes(`sr.`) ||
      jobTitle.includes(`architect`)
    ) {
      return false;
    }

    // * return boolean
    return true;
  });

  console.log(`Filtered out to :: `, jrJobs.length, `jr. jobs`);

  // * Store `jrJobs` into Redis via a key `github`
  const success = await setAsync("github", JSON.stringify(jrJobs));
  console.log({ success });
};

// * Export the @fn
module.exports = fetchGithub;
