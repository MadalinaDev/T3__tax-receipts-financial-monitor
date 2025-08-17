"use client";
import { useState, useEffect, useRef } from "react";
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
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // -------- when user clicks outside of the mobile menu, it automatically closes ----------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-100 bg-white/80 shadow-[0_3px_6px_-1px_#e5e7eb]">
      <div className="text-md mx-auto flex w-full max-w-[1580px] flex-row items-center justify-between gap-x-4 px-8 py-4 md:gap-x-12 md:px-36">
        <Link href="/">
          <Image src="/logo.png" alt="ReceiptIQ logo" width={120} height={28} />
        </Link>

        {/* ------------- mobile menu btn -------------- */}
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden"
          >
            <Menu className="text-navy-blue size-6" />
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden"
          >
            <X className="text-navy-blue size-6" />
          </button>
        )}

        {/* ------------- desktop menu -------------- */}
        <nav className="md:justify-content hidden md:my-0 md:flex md:flex-row md:items-center md:gap-12">
          <NavLinks />
          <UserButtons />
        </nav>
      </div>
      {/* ------------- mobile menu -------------- */}
      {isOpen && (
        <nav
          ref={menuRef}
          className="flex flex-col items-center justify-center gap-2 md:hidden"
        >
          <NavLinks />
          <UserButtons />
        </nav>
      )}
    </header>
  );
};

const NavLinks = () => {
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
    <>
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
    </>
  );
};

const UserButtons = () => {
  return (
    <div className="mt-2 mb-6 flex w-full flex-row items-center justify-center md:my-0 md:flex md:justify-end">
      <SignedOut>
        <SignInButton>
          <Button
            variant="outline"
            size="sm"
            className="bg-yellow cursor-pointer px-4 text-sm"
          >
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button
            size="sm"
            className="bg-navy-blue ml-2 cursor-pointer px-4 text-white hover:bg-black md:ml-4"
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
  );
};

export default Header;
