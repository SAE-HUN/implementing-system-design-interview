export class Storage {
  private cache: Map<string, string>;

  constructor() {
    this.cache = new Map<string, string>();
  }

  public get(key: string): string | undefined {
    //TODO: Merkle tree
    return this.cache.get(key);
  }

  public put(key: string, value: string): Map<string, string> {
    //TODO: SSTable
    return this.cache.set(key, value);
  }
}
