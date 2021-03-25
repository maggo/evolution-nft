import { arg, args, config, decode, script, send } from "@onflow/fcl";
import { Address } from "@onflow/types";
import { useState } from "react";
import { useQuery } from "react-query";

config().put("accessNode.api", "https://access-mainnet-beta.onflow.org");

export default function Home() {
  const [address, setAddress] = useState(null);

  const { data: tokens, isLoading, isError } = useQuery(
    ["tokens", address],
    () => getAccountTokens(address),
    {
      enabled: !!address,
    }
  );

  return (
    <>
      <style jsx>{`
        .container {
          padding: 3rem;
          text-align: center;
        }

        input {
          margin-right: 0.5rem;
        }

        ul {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          list-style: none;
          padding: 0;
        }

        li {
          margin: 1rem;
        }

        img {
          width: 100%;
          max-width: 360px;
          margin-bottom: 1rem;
          aspect-ratio: 360 / 520;
        }

        .title {
          margin: 0;
        }

        .description {
          margin: 0.5rem 0;
        }
      `}</style>
      <div className="container">
        <h1>Revolution</h1>
        <p>Enter your account address to see your Evolution NFTs</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const el = e.currentTarget.elements.namedItem(
              "address"
            ) as HTMLInputElement;
            setAddress(el.value);
          }}
        >
          <input name="address" type="text" autoFocus />
          <button>Submit</button>
        </form>
        {isError && <p>Ooops error…</p>}
        {isLoading && <p>Loading…</p>}
        {!!tokens?.length && (
          <ul>
            {tokens.map((token) => (
              <li>
                <img src={token.image} />
                <p>#{token.id}</p>
                <h2 className="title">{token.title}</h2>
                <p className="description">{token.description}</p>
                <p>
                  {token.serialNumber} / {token.total}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

interface Token {
  id: string;
  serialNumber: string;
  total: string;
  image: string;
  title: string;
  description: string;
}

async function getAccountTokens(address: string): Promise<Token[]> {
  try {
    const response = await send([
      script`
        import Evolution from 0xf4264ac8f3256818
  
        pub struct NFTAndMetadata {
          pub let nft: &Evolution.NFT
          pub let metadata: {String: String}
          pub let total: UInt32
  
          init(nft: &Evolution.NFT, metadata: {String: String}, total: UInt32) {
              self.nft = nft
              self.metadata = metadata
              self.total = total
          }
        }
  
        pub fun main(account: Address): { UInt64: NFTAndMetadata } {
          let acct = getAccount(account)
  
          let collectionRef = acct.getCapability(/public/f4264ac8f3256818_Evolution_Collection)
                              .borrow<&{Evolution.EvolutionCollectionPublic}>()!
  
          let tokens: { UInt64: NFTAndMetadata } = {};
  
          for id in collectionRef.getIDs() {
            let nft = collectionRef.borrowCollectible(id: id)!
            let metadata = Evolution.getItemMetadata(itemId: nft.data.itemId)!
            let total = Evolution.getNumberCollectiblesInEdition(
              setId: nft.data.setId, 
              itemId: nft.data.itemId
            )!
  
            tokens[id] = NFTAndMetadata(
              nft: nft,
              metadata: metadata,
              total: total
            )
          }
  
          return tokens
        }
      `,
      args([arg(address, Address)]),
    ]);

    const data = await decode(response);

    console.log(data);

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
