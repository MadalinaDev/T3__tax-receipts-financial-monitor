"use client";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Header = () => {
  return (
    <div>
      <div className="text-md flex min-h-[10vh] flex-col items-center gap-x-4 bg-gray-200 px-12 py-2 md:flex-row md:gap-x-12 md:px-36 md:py-4">
        <Link href="/" className="whitespace-nowrap">
          Financial Monitor
        </Link>
        <Link href="/upload" prefetch={false}>
          Upload
        </Link>
        <Link href="/receipts" prefetch={false}>
          Receipts
        </Link>
        <Link href="/statistics" prefetch={false}>
          Statistics
        </Link>
        <div className="flex w-full flex-row items-center justify-center md:justify-end">
          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="ml-2 cursor-pointer rounded-full bg-gray-500 px-4 py-2 text-sm font-medium text-white md:ml-6">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10 ring-2 ring-gray-500 md: my-0 my-2",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Header;
