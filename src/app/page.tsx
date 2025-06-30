import { HydrateClient } from "~/trpc/server";
import Home from "~/components/client/home";

export default async function Homepage() {

  return (
    <HydrateClient>
      <Home />
    </HydrateClient>
  );
}
