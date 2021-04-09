import { config } from "@onflow/fcl";

export function setup() {
  config()
    .put("accessNode.api", "https://access-mainnet-beta.onflow.org")
    .put("fcl.eventPollRate", 2000);
}
