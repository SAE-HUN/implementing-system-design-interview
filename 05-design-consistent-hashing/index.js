import express from "express";
import { ConsistentHash } from "./consistentHash.js";
import cron from "node-cron";
import yaml from "js-yaml";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"));
let consistentHash = new ConsistentHash(
  config["hash_algorithm"],
  config["number_of_nodes"],
  config["number_of_replicas"]
);
cron.schedule("*/1 * * * *", () => {
  config = yaml.load(fs.readFileSync("./config.yaml", "utf8"));
  consistentHash = new ConsistentHash(
    config["hash_algorithm"],
    config["number_of_nodes"],
    config["number_of_replicas"]
  );
});

const proxyApp = express();

proxyApp.get("/", (req, res) => {
  res.send("Hello Node.js!");
});

proxyApp.get("/:key", (req, res) => {
  const node = consistentHash.get(req.params.key);
  res.setHeader("X-CacheServer-Index", node);
  res.setHeader("X-CacheServer-Count", config["number_of_nodes"]);
  res.send("Hello Node.js!");
});

proxyApp.listen(process.env.PROXY_PORT, () => {
  console.log(`Proxy server listening on ${process.env.PROXY_PORT}`);
});
