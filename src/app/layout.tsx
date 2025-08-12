import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import Header from "~/components/layout/header";
// import Footer from "~/components/layout/footer";
import { HydrateClient } from "~/trpc/server";
import { ClerkProvider } from "@clerk/nextjs";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en">
          <body>
            <NuqsAdapter>
              <HydrateClient>
                <Header />
                <div className="text-muted-foregroud! mx-8 md:mx-36">
                  {children}
                </div>
                {/* <Footer /> */}
              </HydrateClient>
            </NuqsAdapter>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
