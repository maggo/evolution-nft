import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "../../components/Container";
import { Navigation } from "../../components/Navigation";

export default function CollectionPage() {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Collections</title>
      </Head>
      <Navigation />
      <Container>
        <h1 className="text-5xl font-black text-center mb-8">
          Enter a flow address
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const address = (e.currentTarget.elements.namedItem(
              "address"
            ) as HTMLInputElement).value;

            if (address) {
              router.push(`/collections/${address}`);
            }
          }}
          className="mx-auto max-w-lg space-y-4"
        >
          <input
            type="text"
            name="address"
            className="w-full rounded px-4 py-2"
            placeholder="0x123456789"
          />
          <button className="px-4 py-2 rounded w-full bg-indigo-500 text-white">
            Submit
          </button>
        </form>
      </Container>
    </div>
  );
}
