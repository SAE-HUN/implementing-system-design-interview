import cron from "node-cron";
import axios from "axios";

import { Storage } from "./storage";
import { MemberManager, Member } from "./member-manager";

export class Node {
  private nodeId: string;
  private suspictionThreshold: number;
  private failureThreshold: number;

  private storage: Storage;
  private memberManager: MemberManager;

  constructor(
    nodeIP: string,
    port: number,
    suspictionThreshold: number,
    failureThreshold: number
  ) {
    this.nodeId = `${nodeIP}:${port}`;
    this.suspictionThreshold = suspictionThreshold;
    this.failureThreshold = failureThreshold;

    this.storage = new Storage();
    this.memberManager = new MemberManager();
  }

  public intialize() {
    this.memberManager.initialize(this.nodeId);

    cron.schedule("*/30 * * * * *", () => {
      this.memberManager.heartbeats(this.nodeId);
      this.memberManager.detectSuspectedNodes(
        this.suspictionThreshold,
        this.nodeId
      );
      this.memberManager.removeDeadNodes(this.failureThreshold, this.nodeId);

      const peers: string[] = this.memberManager.choosePeers(3, this.nodeId);
      const membership: Member[] = this.memberManager.getMembership();
      peers.forEach(async (peer: string) => {
        try {
          const res = axios.post(`http://${peer}/membership`, {
            membership,
          });
        } catch (e) {
          throw e;
        }
      });
    });
  }

  public addNodes(nodeIds: string[]) {
    this.memberManager.addMembers(nodeIds);
  }

  public get(key: string): string | null {
    // TODO: Proxy role
    const value = this.storage.get(key);
    return value !== undefined ? value : null;
  }

  public put(key: string, value: string): Map<string, string> {
    // TODO: Proxy role
    return this.storage.put(key, value);
  }

  public getMembership(): Member[] {
    return this.memberManager.getMembership();
  }

  public updateMembership(membership: Member[]) {
    return this.memberManager.updateMembership(membership);
  }
}
