import { config } from "@onflow/fcl";

export function setup() {
  config()
    .put("accessNode.api", "http://access.mainnet.nodes.onflow.org:9000")
    .put("fcl.eventPollRate", 2000);
}
