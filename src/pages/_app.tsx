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
      <script
        async
        defer
        data-domain="evolution-nft.netlify.app"
        src="https://plausible.io/js/plausible.js"
      />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
