import React from "react";
import { Container } from "../components/Container";
import { Footer } from "../components/Footer";
import { Navigation } from "../components/Navigation";
import { Sales } from "../container/Sales";

export default function Home() {
  return (
    <>
      <Navigation />

      <Container>
        <Sales />
      </Container>

      <Footer />
    </>
  );
}
