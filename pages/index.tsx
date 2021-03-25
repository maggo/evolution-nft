import { arg, args, config, decode, script, send } from "@onflow/fcl";
import { Address } from "@onflow/types";
import React, { useState } from "react";
import { useQuery } from "react-query";
import Head from "next/head";

config().put("accessNode.api", "https://access-mainnet-beta.onflow.org");

export default function Home() {
  const [address, setAddress] = useState(null);

  const { data: tokens, isLoading, isError } = useQuery(
    ["tokens", address],
    () => getAccountTokens(address),
    {
      enabled: !!address,
      retry: false,
    }
  );

  return (
    <>
      <script
        async
        defer
        data-domain="evolution-nft.netlify.app"
        src="https://plausible.io/js/plausible.js"
      ></script>
      <Head>
        <title>viv3 la evolution!</title>
      </Head>
      <style jsx>{`
        .container {
          padding: 3rem;
          text-align: center;
        }

        input {
          margin-right: 0.5rem;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        .tokens {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          list-style: none;
          padding: 0;
        }

        .tokens li {
          margin: 1rem;
          text-align: left;
        }

        img {
          width: 100%;
          max-width: 360px;
          aspect-ratio: 360 / 520;
        }

        .id {
          margin: 0;
        }

        .title {
          margin: 0;
          font-size: 3rem;
          line-height: 1;
        }

        .description {
          margin: 0.5rem 0;
        }

        a {
          text-decoration: underline;
        }

        input,
        button {
          padding: 0.5rem 1rem;
        }

        form {
          margin: 3rem 0;
        }

        .error {
          color: hsl(0, 80%, 50%);
        }

        .meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
      <div className="container">
        <h1>viv3 la evolution!</h1>
        <ul>
          <li>
            1. Get your address from the{" "}
            <a href="https://viv3.com/balance">VIV3 Balance page</a> (click the
            Deposit button)
          </li>
          <li>2. Add it below and click submit</li>
          <li>3. ???</li>
          <li>4. Profit!</li>
        </ul>
        <p>
          Source:{" "}
          <a href="https://github.com/maggo/evolution-nft">
            github.com/maggo/evolution-nft
          </a>
        </p>
        <p>
          <strong>NOT affiliated with VIV3 or Ben Mauro</strong>, just doing
          blockchain stuff {"<3"}
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const el = e.currentTarget.elements.namedItem(
              "address"
            ) as HTMLInputElement;
            setAddress(el.value.trim());
          }}
        >
          <input
            name="address"
            type="text"
            autoFocus
            placeholder="0xabcdef1234567890"
          />
          <button>Submit</button>
        </form>
        {isError && (
          <div className="error">
            <p>Ooops there was an error…</p>
            <p>Maybe the address is wrong, or you just don't own any tokens</p>
          </div>
        )}
        {isLoading && <p>Loading…</p>}
        {!!tokens?.length && (
          <ul className="tokens">
            {tokens.map((token) => (
              <li key={token.id}>
                <img src={token.image} />
                <div className="meta">
                  <p>#{token.id}</p>
                  <p>
                    Serial number: {token.serialNumber} / {token.total}
                  </p>
                </div>

                <h2 className="title">{token.title}</h2>
                <p className="description">{token.description}</p>
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
