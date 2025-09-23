import { HydrateClient } from "~/trpc/server";
import Home from "~/components/client/homePage/home";

export default async function Homepage() {

  return (
    <HydrateClient>
      <Home />
    </HydrateClient>
  );
}
