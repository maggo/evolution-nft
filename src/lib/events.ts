import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";
import { timeout } from "./helpers";

const DEFAULT_TIMEOUT = 10000;

const VIV3_EVENT = {
  contractName: "VIV3",
  contractAddress: "c2d564119d2e5c3d",
  blockCount: 1000,
};

const EVOLUTION_EVENT = {
  contractName: "Evolution",
  contractAddress: "f4264ac8f3256818",
  blockCount: 1000,
};

export interface Purchase {
  txId: string;
  blockHeight: number;
  tokenId: number;
  price: number;
  from: string;
  to: string;
}

export async function getAllEvents(
  from?: number,
  to?: number
): Promise<Purchase[]> {
  const allEventsPromise = Promise.all([
    eventsHelper({
      ...EVOLUTION_EVENT,
      eventName: "Withdraw",
      from,
      to,
    }),
    eventsHelper({
      ...EVOLUTION_EVENT,
      eventName: "Deposit",
      from,
      to,
    }),
    eventsHelper({
      ...VIV3_EVENT,
      eventName: "TokenPurchased",
      from,
      to,
    }),
  ]);

  const allEvents = await Promise.race([
    allEventsPromise,
    timeout(DEFAULT_TIMEOUT),
  ]);

  if (!allEvents) throw new Error("TIMEOUT");

  console.log("All Events", allEvents);

  const [withdraws, deposits, purchases] = allEvents;

  const transformedAndSortedPurchases = purchases
    .reduce((_, p) => {
      const txId = p.transactionId;
      const blockHeight = p.blockHeight;
      const withdraw = withdraws.find((w) => w.transactionId === txId);
      const deposit = deposits.find((w) => w.transactionId === txId);

      // This is not a Evolution purchase
      if (!withdraw || !deposit) return _;

      return [
        ..._,
        {
          txId,
          blockHeight,
          tokenId: parseInt(
            p.payload.value.fields.find((f) => f.name === "id").value.value
          ),
          price: parseFloat(
            p.payload.value.fields.find((f) => f.name === "price").value.value
          ),
          from: withdraw
            ? withdraw.payload.value.fields.find((f) => f.name === "from").value
                .value.value
            : null,
          to: deposit
            ? deposit.payload.value.fields.find((f) => f.name === "to").value
                .value.value
            : null,
        },
      ];
    }, [])
    .sort((a, b) => (a.blockHeight > b.blockHeight ? -1 : 1));

  return transformedAndSortedPurchases;
}

interface EventsHelperProps {
  contractAddress: string;
  contractName: string;
  eventName: string;
  from?: number;
  to?: number;
  blockCount?: number;
}

async function eventsHelper(params: EventsHelperProps): Promise<any[]> {
  // Define event type from params
  const { contractAddress, contractName, eventName } = params;
  const eventType = `A.${contractAddress}.${contractName}.${eventName}`;

  const { from = 0, to, blockCount = 100 } = params;
  let toBlock: number;
  if (to === undefined) {
    // Get latest block
    const blockResponse = await fcl.send(
      await sdk.build([sdk.getLatestBlock()])
    );
    toBlock = blockResponse.block.height;
  } else {
    toBlock = to;
  }

  let fromBlock = from;

  // Load the last 100 blocks by default
  if (!fromBlock) fromBlock = toBlock - blockCount;

  const response = await fcl.send(
    await sdk.build([
      sdk.getEventsAtBlockHeightRange(eventType, fromBlock, toBlock),
    ])
  );

  // Return a list of events
  return response.events;
}

export async function getLatestBlockHeight(): Promise<number> {
  const blockPromise = fcl.send(await sdk.build([sdk.getBlock(true)]));
  const blockResponse = await Promise.race([
    blockPromise,
    timeout(DEFAULT_TIMEOUT),
  ]);
  if (!blockResponse) throw new Error("TIMEOUT");

  return blockResponse.block.height;
}
