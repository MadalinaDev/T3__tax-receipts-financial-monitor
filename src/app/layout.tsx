import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import Header from "~/components/layout/header";
import Footer from "~/components/layout/footer";

import { HydrateClient } from "~/trpc/server";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>
          <HydrateClient>
            <Header />
            {children}
            <Footer />
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
