import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import Header from "~/components/layout/header";
import Footer from "~/components/layout/footer";
import { HydrateClient } from "~/trpc/server";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en">
          <body>
            <HydrateClient>
              <Header />
              <div className="mx-36 min-h-[88vh]">{children}</div>
              <Footer />
            </HydrateClient>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
