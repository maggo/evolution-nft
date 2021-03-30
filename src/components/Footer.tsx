import { Container } from "./Container";

export function Footer() {
  return (
    <Container>
      <div className="border-t border-gray-300 pt-2 text-center text-sm">
        Source:{" "}
        <a
          className="text-indigo-600"
          href="https://github.com/maggo/evolution-nft"
          target="_blank"
        >
          github.com/maggo/evolution-nft
        </a>{" "}
        by{" "}
        <a
          className="text-indigo-600"
          href="https://twitter.com/mediaquery"
          target="_blank"
        >
          @mediaquery
        </a>{" "}
        / maggo#1337 | Flow Address for donations: 0xf6337be8d00d3950 {"<3"}
        <div>
          <strong className="font-semibold">
            NOT affiliated with VIV3 or Ben Mauro
          </strong>
          , just doing blockchain stuff!
        </div>
      </div>
    </Container>
  );
}
