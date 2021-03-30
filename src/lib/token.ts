import { arg, args, decode, script, send } from "@onflow/fcl";
import { Address, UInt64 } from "@onflow/types";
import getAllTokensScript from "raw-loader!../cadence/scripts/get_all_tokens_of_address.cdc";
import getTokenMetadataScript from "raw-loader!../cadence/scripts/get_token_metadata.cdc";

export interface Token {
  id: number;
  serialNumber: string;
  total: string;
  image: string;
  title: string;
  description: string;
}

export async function getAccountTokens(address: string): Promise<Token[]> {
  try {
    const response = await send([
      script(getAllTokensScript),
      args([arg(address, Address)]),
    ]);

    const data = await decode(response);

    return Object.entries<any>(data).map(([id, { nft, metadata, total }]) => ({
      id: nft.id,
      serialNumber: nft.data.serialNumber,
      total,
      image: `https://storage.viv3.com/0xf4264ac8f3256818/m/${nft.data.itemId}`,
      title: metadata.Title,
      description: metadata.Description,
    }));
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getTokenMetadata(
  address: string,
  tokenId: number
): Promise<Token> {
  try {
    const response = await send([
      script(getTokenMetadataScript),
      args([arg(address, Address), arg(tokenId, UInt64)]),
    ]);

    const { nft, metadata, total } = await decode(response);

    return {
      id: nft.id,
      serialNumber: nft.data.serialNumber,
      total,
      image: `https://storage.viv3.com/0xf4264ac8f3256818/m/${nft.data.itemId}`,
      title: metadata.Title,
      description: metadata.Description,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
}
