const express = require("express");
const redis = require("redis");
require("dotenv").config();

const app = express();
const redis_client = redis.createClient(
  process.env.PORT_REDIS,
  process.env.URL_REDIS
);
redis_client.connect();

app.get("/", (req, res) => {
  res.send("Hello Node.js!");
});

app.get("/:token/:method", async (req, res) => {
  const token = req.params.token;
  const method = req.params.method;

  const getMulti = redis_client.multi();
  getMulti.get(`LIMIT_RULE:REQUIRED_API_CREDITS:${method}`);
  getMulti.get(`LIMIT_RULE:${token}:API_CREDITS_PER_MONTH`);
  getMulti.get(`LIMIT_RULE:${token}:REQUESTS_PER_SEC`);
  getMulti.get(`LIMIT_RULE:${token}:REQUESTS_BUCKET_SIZE`);

  getMulti.get(`API_CREDITS:${token}:LAST_CHECK_TIME`);
  getMulti.get(`API_CREDITS:${token}:COUNTER`);

  getMulti.get(`REQUESTS:${token}:LAST_CHECK_TIME`);
  getMulti.get(`REQUESTS:${token}:TOKENS_IN_BUCKET`);

  const result = await getMulti.exec();

  const required_api_credits = Number(result[0]);
  const api_credits_per_month = Number(result[1]);
  const requests_per_sec = Number(result[2]);
  const requests_bucket_size = Number(result[3]);

  const api_credits_last_check_time = Number(result[4]);
  let api_credits_counter = Number(result[5]);

  const requests_last_check_time = Number(result[6]);
  let tokens_in_bucket = Number(result[7]);

  const date = new Date();
  const now = Math.round(date.getTime() / 1000);
  const month_unit = 60 * 60 * 24 * 30;

  if (now > api_credits_last_check_time + month_unit) {
    api_credits_counter = 0;
  }
  api_credits_counter += required_api_credits;

  tokens_in_bucket = Math.min(
    tokens_in_bucket + requests_per_sec * (now - requests_last_check_time),
    requests_bucket_size
  );
  tokens_in_bucket -= 1;

  if (api_credits_counter > api_credits_per_month || tokens_in_bucket < 0) {
    res.setHeader(
      "X-Ratelimit-Retry-After",
      Math.max(
        Math.round(
          new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime() / 1000
        ) - now,
        1
      )
    );
    res.status(429);
    return res.send();
  }

  const setMulti = redis_client.multi();
  setMulti.set(`API_CREDITS:${token}:LAST_CHECK_TIME`, now);
  setMulti.set(`API_CREDITS:${token}:COUNTER`, api_credits_counter);
  setMulti.set(`REQUESTS:${token}:LAST_CHECK_TIME`, now);
  setMulti.set(`REQUESTS:${token}:TOKENS_IN_BUCKET`, tokens_in_bucket);
  await setMulti.exec(); // TODO: Execute update using atomic transaction

  res.setHeader(
    "X-Ratelimit-Remaining",
    Math.min(
      Math.round(
        (api_credits_per_month - api_credits_counter) / required_api_credits
      ),
      tokens_in_bucket
    )
  );
  res.setHeader(
    "X-Ratelimit-Limit",
    JSON.stringify({ api_credits_per_month, requests_per_sec })
  );
  return res.send("Success"); // TODO: Forward to main server
});

app.listen(process.env.PORT_APP, () => {
  console.log("Listening...");
});
