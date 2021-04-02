import { config } from "@onflow/fcl";

export function setup() {
  config()
    .put("accessNode.api", "https://flow-access-mainnet.portto.io")
    .put("fcl.eventPollRate", 2000);
}
