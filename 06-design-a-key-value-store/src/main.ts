import { Node } from "./node";
import { ClientAPI } from "./client-api";

interface NodeInfo {
  nodeIP: string;
  port: number;
}

async function main() {
  const suspictionThreshold = 60 * 1000;
  const failureThreshold = 120 * 1000;
  const nodeIP = "127.0.0.1";
  const defaultPort = 3000;
  const nodeCount = 10;
  const peersCount = 5;
  const nodeInfoList: NodeInfo[] = [];
  for (let port: number = defaultPort; port < defaultPort + nodeCount; port++) {
    nodeInfoList.push({ nodeIP, port });
  }

  for (let i: number = 0; i < nodeInfoList.length; i++) {
    const nodeIP = nodeInfoList[i].nodeIP;
    const port = nodeInfoList[i].port;

    const node = new Node(
      nodeIP,
      port,
      suspictionThreshold,
      failureThreshold,
      peersCount
    );
    node.intialize();
    node.addNodes(
      nodeInfoList.map((nodeInfo) => `${nodeInfo.nodeIP}:${nodeInfo.port}`)
    );
    const clientAPI = new ClientAPI(port, node);
    clientAPI.initialize();
  }
}
main();
