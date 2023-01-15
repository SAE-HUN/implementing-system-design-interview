const enum STATUS {
  ALIVE,
  SUSPECTED,
}

export interface Member {
  nodeId: string;
  heartbeatCount: number;
  lastTimestamp: number;
  status: STATUS;
}

// TODO: Fix class name
export class MemberManager {
  private membership: Map<string, Member>;

  constructor() {
    this.membership = new Map<string, Member>();
  }

  public initialize(nodeId: string) {
    this.addMembers([nodeId]);
  }

  public addMembers(nodeIds: string[]) {
    nodeIds.forEach((nodeId) => {
      if (this.membership.has(nodeId)) return;
      this.membership.set(nodeId, {
        nodeId,
        heartbeatCount: 0,
        lastTimestamp: Date.now(),
        status: STATUS.ALIVE,
      });
    });
  }

  public choosePeers(peersCount: number, exclude: string): string[] {
    const candidates: string[] = [];
    this.membership.forEach((_: any, nodeId: string) => {
      if (nodeId !== exclude) candidates.push(nodeId);
    });
    return candidates.sort(() => Math.random() - 0.5).slice(0, peersCount);
  }

  public heartbeats(nodeId: string) {
    const self = this.membership.get(nodeId);
    self!.heartbeatCount += 1;
    self!.lastTimestamp = Date.now();
    self!.status = STATUS.ALIVE;
    this.membership.set(nodeId, self!);
  }

  public getMembership(): Member[] {
    const membership: Member[] = [];
    this.membership.forEach((member: Member) => {
      membership.push(member);
    });
    return membership;
  }

  public updateMembership(membership: Member[]) {
    membership.forEach((member: Member) => {
      const memberOfMyMembership = this.membership.get(member.nodeId);
      if (memberOfMyMembership === undefined) {
        this.membership.set(member.nodeId, member);
        return;
      }
      if (
        memberOfMyMembership.lastTimestamp < member.lastTimestamp ||
        memberOfMyMembership.heartbeatCount < member.heartbeatCount
      ) {
        this.membership.set(member.nodeId, member);
      }
    });
  }

  public detectSuspectedNodes(threshold: number, excludedNodeId: string) {
    const now = Date.now();
    this.membership.forEach((member: Member) => {
      if (member.nodeId === excludedNodeId) return;
      if (member.status !== STATUS.ALIVE) {
        return;
      }
      if (member.lastTimestamp < now - threshold) {
        member.status = STATUS.SUSPECTED;
        this.membership.set(member.nodeId, member);
      }
    });
  }

  public removeDeadNodes(threshold: number, excludedNodeId: string) {
    const now = Date.now();
    const memberIdsToDelete: string[] = [];
    this.membership.forEach((member: Member) => {
      if (member.nodeId === excludedNodeId) return;
      if (member.status !== STATUS.SUSPECTED) return;
      if (member.lastTimestamp < now - threshold) {
        memberIdsToDelete.push(member.nodeId);
      }
    });
    memberIdsToDelete.forEach((nodeId) => {
      this.membership.delete(nodeId);
    });
  }
}
