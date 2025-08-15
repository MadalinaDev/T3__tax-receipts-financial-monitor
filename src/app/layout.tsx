import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import Header from "~/components/layout/header";
import Footer from "~/components/layout/footer";
import { HydrateClient } from "~/trpc/server";
import { ClerkProvider } from "@clerk/nextjs";
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
            className={`${montserrat.variable} ${openSans.variable} antialiased text-navy-blue`}
          >
            <HydrateClient>
              <Header />
              <div className="px-8 md:px-36 mx-auto max-w-[1580px]">{children}</div>
              <Footer />
            </HydrateClient>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
