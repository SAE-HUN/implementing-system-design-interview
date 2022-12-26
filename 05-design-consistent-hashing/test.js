import axios from "axios";
import yaml from "js-yaml";
import fs from "fs";

async function main() {
  let res = [];
  let ran = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  for (let i = 0; i < 400; i++) {
    res.push(axios.get(`http://localhost:3000/${ran + i}`));
  }
  res = await Promise.all(res);

  const map = {};

  const config = yaml.load(fs.readFileSync("./config.yaml", "utf8"));
  for (let i = 0; i < config["number_of_nodes"]; i++) {
    map[i] = 0;
  }
  for (const r of res) {
    map[r.headers["x-cacheserver-index"]] += 1;
  }
  console.log(map);
}

main();
