import { useRouter } from "next/router";
import { Container } from "../../components/Container";
import { Navigation } from "../../components/Navigation";
import { Collection } from "../../container/Collection";

export default function CollectionPage() {
  const router = useRouter();
  const address = router.query.address?.toString();

  return (
    <div>
      <Navigation />
      <Container>
        <Collection address={address} />
      </Container>
    </div>
  );
}
