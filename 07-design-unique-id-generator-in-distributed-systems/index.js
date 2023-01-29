import { UniqueIdGenerator } from "./unique-id-generator.js";

function main() {
  const uniqueIdGenerator = new UniqueIdGenerator(42, 5, 5, 12, 0, 0);
  const uniqueId = uniqueIdGenerator.generateId(0);
  console.log("uniqueId", uniqueId);
  const parsedUniqueId = uniqueIdGenerator.parseId(uniqueId);
  console.log("parsedUniqueId", parsedUniqueId);
}
main();
