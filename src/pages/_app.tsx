import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { setup } from "../lib/flow";
import { Token } from "../lib/token";
import "../styles/globals.css";

const queryClient = new QueryClient();
queryClient.setQueryData("tokenMetadata", new Map<number, Token>());

setup();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
