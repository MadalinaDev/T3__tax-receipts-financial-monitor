import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import Header from "~/components/layout/header";
// import Footer from "~/components/layout/footer";
import { HydrateClient } from "~/trpc/server";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en">
          <body className="font-custom tracking-wide text-navy-blue">
            <HydrateClient>
              <Header />
              <div className="md:mx-36 mx-8">{children}</div>
              {/* <Footer /> */}
            </HydrateClient>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
