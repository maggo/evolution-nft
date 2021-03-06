import { useQuery, useQueryClient } from "react-query";
import { Badge } from "../components/Badge";
import { Spinner } from "../components/Spinner";
import { getAccountTokens, Token } from "../lib/token";
import Head from "next/head";
import { FlowscanIcon } from "../icons/FlowscanIcon";
import Link from "next/link";

export function Collection({ address }) {
  const queryClient = useQueryClient();
  const { data: tokens, isLoading } = useQuery(
    ["collection", address],
    () => getAccountTokens(address),
    {
      enabled: !!address,
      retry: false,
      onSuccess(data) {
        const tokenMetadata = queryClient.getQueryData<Map<number, Token>>(
          "tokenMetadata"
        );
        data.forEach((t) => tokenMetadata.set(t.id, t));
        queryClient.setQueryData("tokenMetadata", tokenMetadata);
      },
    }
  );

  return (
    <div className="space-y-8">
      <Head>
        <title>Collection of {address}</title>
      </Head>
      <h1 className="text-5xl font-black break-all">Collection of {address}</h1>

      <div>
        <a href={`https://flowscan.org/account/${address}`}>
          <Badge
            label="Open in Flowscan"
            icon={<FlowscanIcon className="w-4 h-4 mr-1" />}
          />
        </a>
      </div>

      {isLoading ? (
        <Spinner />
      ) : !tokens?.length ? (
        <p>This collection is empty…</p>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-10 items-start">
          {tokens.map((token) => (
            <li key={token.id}>
              <div className="space-y-4">
                <img
                  width={360}
                  height={520}
                  className="object-cover shadow-lg rounded-lg max-w-full"
                  src={token.image}
                />
                <div className="text-lg leading-6 space-y-1">
                  <h2 className="text-3xl font-black">{token.title}</h2>
                  <p className="text-base">{token.description}</p>
                  <p className="text-indigo-600 text-base">
                    # {token.serialNumber} / {token.total}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
