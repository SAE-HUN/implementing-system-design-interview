import express, { Express, Request, Response } from "express";
import { Node } from "./node";

export class ClientAPI {
  private app: Express;
  private port: number;

  private node: Node;

  constructor(port: number, node: Node) {
    this.app = express();
    this.port = port;
    this.node = node;
  }
  public initialize() {
    this.app.use(express.json());

    this.app.get("/membership", (req: Request, res: Response) => {
      res.send(this.node.getMembership());
    });

    this.app.post("/membership", (req: Request, res: Response) => {
      res.send(this.node.updateMembership(req.body.membership));
    });

    this.app.get("/:key", (req: Request, res: Response) => {
      //TODO: Resolve read conflict
      res.send(this.node.get(req.params.key));
    });

    this.app.post("/:key", (req: Request, res: Response) => {
      //TODO: Resolve write conflict
      res.send(this.node.put(req.params.key, req.body.value));
    });

    this.app.listen(this.port, () => {
      console.log(
        `⚡️[server]: Server is running at http://localhost:${this.port}`
      );
    });
  }
}
