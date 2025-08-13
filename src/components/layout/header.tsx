"use client";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "../ui/button";

const Header = () => {

  const headerButtons = [
    {
      id: "upload",
      title: "Upload",
      path: "/upload",
    },
    {
      id: "receipts",
      title: "Receipts",
      path: "/receipts",
    },
    {
      id: "statistics",
      title: "Statistics",
      path: "/statistics",
    },
  ];

  return (
    <div className="sticky top-0 flex flex-col">
      <div className="text-md flex flex-col items-center gap-x-4 bg-gray-200 px-12 py-4 md:flex-row md:gap-x-12 md:px-36">
        <Link href="/">
          <Image src="/logo.png" alt="ReceiptIQ logo" width={200} height={46} />
        </Link>

        {headerButtons.map((item) => (
          <Link key={item.id} href={item.path} prefetch={false}>
            <div className="group relative px-2">
              <span className="group-hover:text-yellow duration-200 group-hover:duration-300">
                {item.title}
              </span>
              <span className="bg-yellow absolute right-0 -bottom-1 left-0 mx-auto h-[1px] w-0 duration-200 group-hover:w-[85%] group-hover:duration-300" />
            </div>
          </Link>
        ))}
       
        <div className="flex w-full flex-row items-center justify-center md:justify-end">
          <SignedOut>
            <SignInButton>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer px-4 text-sm"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button
                size="sm"
                className="bg-navy-blue ml-2 cursor-pointer px-4 text-white md:ml-4"
              >
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "w-10 h-10 ring-2 ring-gray-500 md:my-0 my-2",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
      <span className="h-6 w-full bg-linear-to-b from-gray-200 to-transparent" />
    </div>
  );
};

export default Header;
