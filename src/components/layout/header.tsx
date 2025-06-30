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
      <div className="flex flex-row items-center gap-x-12 bg-gray-200 px-36 py-4 text-lg">
        <Link href="">Financial Monitor</Link>
        <Link href="">Upload</Link>
        <Link href="">Receipts</Link>
        <Link href="">Statistics</Link>
        <div className="ml-auto">
          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="ml-6 h-10 cursor-pointer rounded-full bg-gray-500 px-4 text-sm font-medium text-white sm:h-12 sm:px-5 sm:text-base">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10 ring-2 ring-gray-500",
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
