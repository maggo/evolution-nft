import React from "react";
import { Container } from "../components/Container";
import { Footer } from "../components/Footer";
import { Navigation } from "../components/Navigation";
import { Sales } from "../container/Sales";

export default function Home() {
  return (
    <>
      <script
        async
        defer
        data-domain="evolution-nft.netlify.app"
        src="https://plausible.io/js/plausible.js"
      ></script>
      <Navigation />

      <Container>
        <Sales />
      </Container>

      <Footer />
    </>
  );
}
