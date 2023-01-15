import crypto from "crypto";

export class ConsistentHash {
  constructor(hashAlgorithm, numberOfNodes, numberOfReplicas) {
    this.hashAlgorithm = hashAlgorithm;
    this.hashMap = new Map();
    this.sortedKeyArray = [];
    this.numberOfReplicas = numberOfReplicas;

    for (let i = 0; i < numberOfNodes; i++) {
      this.addNode(i);
    }
  }

  addNode(node) {
    for (let i = 0; i < this.numberOfReplicas; i++) {
      const nodeKey = crypto
        .createHash(this.hashAlgorithm)
        .update(node.toString() + "_" + i)
        .digest("hex");
      this.hashMap.set(nodeKey, node);
      this.sortedKeyArray.push(nodeKey);
    }
    this.sortedKeyArray = this.sortedKeyArray.sort();
  }

  get(key) {
    if (!this.hashMap || this.hashMap.size === 0) {
      return null;
    }

    let hash = crypto
      .createHash(this.hashAlgorithm)
      .update(String(key))
      .digest("hex");
    if (!this.hashMap.has(hash)) {
      hash = this.findHash(hash);
    }
    return this.hashMap.get(hash);
  }

  findHash = (target) => {
    if (
      target <= this.sortedKeyArray[0] ||
      target > this.sortedKeyArray[this.sortedKeyArray.length - 1]
    ) {
      return this.sortedKeyArray[0];
    }

    let start = 0;
    let end = this.sortedKeyArray.length - 1;
    let mid;
    while (start <= end) {
      mid = Math.floor((start + end) / 2);
      if (target < this.sortedKeyArray[mid]) {
        end = mid - 1;
      } else {
        start = mid + 1;
      }
    }
    if (parseInt(target, 16) < parseInt(this.sortedKeyArray[mid], 16)) {
      return this.sortedKeyArray[mid];
    } else {
      return this.sortedKeyArray[mid + 1];
    }
  };
}
