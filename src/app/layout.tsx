import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import Header from "~/components/layout/header";
import Footer from "~/components/layout/footer";
import { HydrateClient } from "~/trpc/server";
import { ClerkProvider } from "@clerk/nextjs";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Montserrat } from "next/font/google";
import { Open_Sans } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en">
          <body
            className={`${montserrat.variable} ${openSans.variable} text-navy-blue antialiased`}
          >
            <NuqsAdapter>
              <HydrateClient>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <div className="mx-auto max-w-[1580px] flex-1 px-8 md:px-36">
                    {children}
                  </div>
                  <Footer />
                </div>
              </HydrateClient>
            </NuqsAdapter>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
