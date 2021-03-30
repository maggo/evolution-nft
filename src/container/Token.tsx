import { useMutation, useQuery, useQueryClient } from "react-query";
import { Token as TokenComponent } from "../components/Token";
import { Purchase } from "../lib/events";
import { getTokenMetadata, Token as TokenType } from "../lib/token";

interface Props {
  address: string;
  id: number;
}

export function Token({ address, id }: Props) {
  const queryClient = useQueryClient();
  const { mutate: fetchTokenMetadata, isLoading } = useMutation(
    () => {
      const latestOwner = queryClient
        .getQueryData<{ pages: { events: Purchase[] }[] }>("activity")
        .pages.reduce<Purchase[]>((_, p) => _.concat(p.events), [])
        .find((p) => p.tokenId === id)?.to;
      return getTokenMetadata(latestOwner ?? address, id);
    },
    {
      onSuccess(data) {
        const tokenMetadata = queryClient.getQueryData<Map<number, TokenType>>(
          "tokenMetadata"
        );
        tokenMetadata.set(data.id, data);
        queryClient.setQueryData("tokenMetadata", tokenMetadata);
      },
    }
  );
  const { data } = useQuery<Map<number, TokenType>>("tokenMetadata");

  const tokenMetadata = data?.get(id);

  return (
    <TokenComponent
      id={id}
      image={tokenMetadata?.image}
      title={tokenMetadata?.title}
      description={`# ${tokenMetadata?.serialNumber} / ${tokenMetadata?.total}`}
      loading={isLoading}
      onClick={() => {
        !tokenMetadata && fetchTokenMetadata();
      }}
    />
  );
}
