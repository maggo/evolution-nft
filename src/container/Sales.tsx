import cx from "classnames";
import Head from "next/head";
import React, { HTMLProps } from "react";
import { useInfiniteQuery } from "react-query";
import { Address } from "../components/Address";
import { DataDisplay, DataItem } from "../components/DataDisplay";
import { Spinner } from "../components/Spinner";
import { getAllEvents, getLatestBlockHeight } from "../lib/events";
import { formatFlow } from "../lib/formatter";
import { Token } from "./Token";

const NUM_BLOCKS_TO_REQUEST = 250;
const ESTIMATED_BLOCK_TIME = 3;

export function Sales() {
  const {
    data,
    fetchNextPage,
    isLoading,
    isFetched,
    isFetchingPreviousPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    isError,
    refetch,
    error,
  } = useInfiniteQuery("activity", getActivity, {
    getPreviousPageParam: ({ lastBlock }) => [lastBlock + 1, undefined],
    getNextPageParam({ firstBlock }) {
      return [undefined, firstBlock - 1];
    },
    retry: false,
    refetchInterval: 10000,
  });

  const blocksByline =
    !isError &&
    isFetched &&
    `in last ${
      (data?.pages.length * NUM_BLOCKS_TO_REQUEST) / 1000
    }k blocks (approx. ${
      (data?.pages.length * NUM_BLOCKS_TO_REQUEST * ESTIMATED_BLOCK_TIME) / 60
    }m)`;
  const volume = data?.pages.reduce(
    (_, p) => _ + p.events.reduce((_, e) => _ + e.price, 0),
    0
  );
  const saleCount = data?.pages.reduce((_, p) => _ + p.events.length, 0);

  return (
    <div className="space-y-8">
      <Head>
        <title>Latest Evolution Sales</title>
      </Head>
      <h1 className="text-5xl font-black">Latest Sales</h1>
      <div className="space-y-2">
        <p>
          Here you can find an up-to-date list of the latest sales of Evolution
          cards on VIV3. Click on the token ID to load its metadata or an
          address to see its collection.
        </p>
        <p>
          This list is generated by combining the{" "}
          <code className="bg-gray-200 px-1.5 rounded-md">Deposit</code>,{" "}
          <code className="bg-gray-200 px-1.5 rounded-md">Withdraw</code> and{" "}
          <code className="bg-gray-200 px-1.5 rounded-md">TokenPurchased</code>{" "}
          events of the{" "}
          <a
            className="underline hover:no-underline"
            href="https://flowscan.org/contract/A.f4264ac8f3256818.Evolution"
          >
            Evolution
          </a>{" "}
          and{" "}
          <a
            className="underline hover:no-underline"
            href="https://flowscan.org/contract/A.c2d564119d2e5c3d.VIV3"
          >
            VIV3
          </a>{" "}
          contracts. The{" "}
          <abbr title="Time to create a new block">block time</abbr> is about{" "}
          {ESTIMATED_BLOCK_TIME}
          seconds and the list refreshes automatically every 10 seconds.
        </p>
      </div>

      <div className="sm:sticky top-20">
        <DataDisplay>
          <DataItem
            title="Number of Sales"
            byline={blocksByline}
            value={isError ? "Error" : !isFetched ? "???" : saleCount}
          />
          <DataItem
            title="Volume"
            byline={blocksByline}
            value={isError ? "Error" : !isFetched ? "???" : formatFlow(volume)}
          />
          <DataItem
            title="Average Price"
            byline={blocksByline}
            value={
              isError
                ? "Error"
                : !isFetched
                ? "???"
                : formatFlow(volume / saleCount)
            }
          />
        </DataDisplay>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="sm:shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHead>
                      {isFetching && (
                        <svg
                          className="animate-spin mr-2 w-4 h-4 absolute -left-5 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      )}
                      Block / Tx
                    </TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Buyer</TableHead>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isError ? (
                    <tr>
                      <TableCell colSpan={5} variant="error">
                        Whoops??? there was an error:{" "}
                        <code>{(error as any).message}</code>. You can try{" "}
                        <button
                          className="underline hover:no-underline"
                          onClick={() => refetch()}
                        >
                          refreshing
                        </button>
                      </TableCell>
                    </tr>
                  ) : (
                    <>
                      {((!isFetched && isLoading) ||
                        isFetchingPreviousPage) && (
                        <tr>
                          <TableCell colSpan={5}>
                            <Spinner />
                          </TableCell>
                        </tr>
                      )}
                      {isFetched && !data?.pages.length && (
                        <tr>
                          <TableCell colSpan={5}>
                            No Sales found in the last {NUM_BLOCKS_TO_REQUEST}{" "}
                            blocks???
                          </TableCell>
                        </tr>
                      )}
                      {data?.pages.map(
                        ({ events, firstBlock, lastBlock }, i) => (
                          <React.Fragment key={i}>
                            {events.length ? (
                              events.map((p) => (
                                <tr key={p.txId}>
                                  <TableCell>
                                    <a
                                      className="block"
                                      href={`https://flowscan.org/transaction/${p.txId}`}
                                      target="_blank"
                                    >
                                      {p.blockHeight}
                                      <div className="text-xs text-gray-500">
                                        {p.txId?.substr(0, 10)}
                                      </div>
                                    </a>
                                  </TableCell>
                                  <TableCell>
                                    <Token address={p.to} id={p.tokenId} />
                                  </TableCell>
                                  <TableCell>{formatFlow(p.price)}</TableCell>
                                  <TableCell>
                                    <Address address={p.from} />
                                  </TableCell>
                                  <TableCell>
                                    <Address address={p.to} />
                                  </TableCell>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <TableCell colSpan={5}>
                                  No sales in range <code>{firstBlock}</code> ???{" "}
                                  <code>{lastBlock}</code>
                                </TableCell>
                              </tr>
                            )}
                          </React.Fragment>
                        )
                      )}
                      {isFetchingNextPage && (
                        <tr>
                          <TableCell colSpan={5}>
                            <Spinner />
                          </TableCell>
                        </tr>
                      )}
                      {hasNextPage && (
                        <tr>
                          <TableCell colSpan={5}>
                            <button
                              className=" text-white text-base py-1.5 px-4 rounded-md bg-indigo-500 hover:bg-indigo-600 transition-colors disabled:bg-indigo-300"
                              onClick={() => fetchNextPage()}
                              disabled={isFetchingNextPage}
                            >
                              Load more sales
                            </button>
                          </TableCell>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// first sale block: 13087720

async function getActivity({
  pageParam: [firstBlockHeight, lastBlockHeight] = [undefined, undefined],
}) {
  const lastBlock = lastBlockHeight || (await getLatestBlockHeight());
  // Make sure that firstBlock <= lastBlock
  const firstBlock = Math.min(
    firstBlockHeight ?? lastBlock - NUM_BLOCKS_TO_REQUEST + 1,
    lastBlock
  );

  console.log("Getting purchases for", firstBlock, lastBlock);

  const events = await getAllEvents(firstBlock, lastBlock);

  return {
    firstBlock,
    lastBlock,
    events,
  };
}

function TableHead({ children }) {
  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
    >
      <div className="relative flex">{children}</div>
    </th>
  );
}

interface TableCellProps extends HTMLProps<HTMLTableCellElement> {
  variant?: "error";
}

function TableCell({ className, variant, ...props }: TableCellProps) {
  return (
    <td
      className={cx(
        `px-6 py-4 whitespace-nowrap`,
        variant === "error" && "bg-red-100",
        className
      )}
      {...props}
    />
  );
}
