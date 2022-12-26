import crypto from "crypto";

export class ConsistentHash {
  hashAlgorithm;
  hashMap;
  sortedKeyArray;
  numberOfReplicas;

  constructor(hashAlgorithm, numberOfNodes, numberOfReplicas) {
    this.hashAlgorithm = hashAlgorithm;
    this.hashMap = new Map();
    this.sortedKeyArray = [];
    this.numberOfReplicas = numberOfReplicas;

    for (let i = 0; i < numberOfNodes; i++) {
      this.add(i);
    }
  }

  add = (node) => {
    for (let i = 0; i < this.numberOfReplicas; i++) {
      const nodeKey = crypto
        .createHash(this.hashAlgorithm)
        .update(node.toString() + "_" + i)
        .digest("hex");
      this.hashMap.set(nodeKey, node);
      this.sortedKeyArray.push(nodeKey);
    }
    this.sortedKeyArray.sort();
  };

  get = (key) => {
    if (!this.hashMap || this.hashMap.size === 0) {
      return null;
    }

    let hash = crypto.createHash(this.hashAlgorithm).update(key).digest("hex");
    if (!this.hashMap.has(hash)) {
      hash = this.findKey(hash);
    }
    return this.hashMap.get(hash);
  };

  findKey = (target) => {
    target = parseInt(target, 16);
    if (
      target <= parseInt(this.sortedKeyArray[0], 16) ||
      target > parseInt(this.sortedKeyArray[this.sortedKeyArray.length - 1], 16)
    ) {
      return this.sortedKeyArray[0];
    }

    let start = 0;
    let end = this.sortedKeyArray.length - 1;
    let mid;
    while (start < end) {
      mid = Math.floor((start + end) / 2);
      if (this.sortedKeyArray[mid] === target) return this.sortedKeyArray[mid];
      if (target < parseInt(this.sortedKeyArray[mid], 16)) {
        end = mid - 1;
      } else {
        start = mid + 1;
      }
    }

    return this.sortedKeyArray[mid + 1];
  };
}
