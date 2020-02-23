/**
 * API with Express Server
 */
// * Dependencies
const express = require("express");
const app = express();
const port = 3001;

// * Redis get
const redis = require("redis");
const client = redis.createClient();

const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/jobs", async (req, res) => {
  const jobs = await getAsync("github");
  return res.send(jobs);
});

app.listen(port, () => console.log(`Server is listening on ${port}`));
