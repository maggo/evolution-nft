import Link from "next/link";
import React from "react";
import { Badge } from "./Badge";

export function Address({ address }) {
  return (
    <Link href={`/collections/${address}`}>
      <a className="font-mono">
        <Badge label={address} />
      </a>
    </Link>
  );
}
