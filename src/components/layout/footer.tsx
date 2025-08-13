"use client";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";

const Footer = () => {
  const footerLinks = [
    {
      name: "Homepage",
      path: "/",
    },
    {
      name: "Upload",
      path: "/upload",
    },
    {
      name: "Receipts",
      path: "/receipts",
    },
    {
      name: "Statistics",
      path: "/statistics",
    },
  ];

  return (
    <footer className="bg-navy-blue text-white py-4">
      <nav className="flex flex-col justify-center items-center gap-4 md:gap-8 px-8 mb-6 md:flex-row md:gap-36 md:px-36">
        {footerLinks.map((link) => (
          <Link key={link.name} href={link.path}>
            <div className="group relative">
              <span className="group-hover:text-yellow/90 duration-200 group-hover:duration-300 px-2">
                {link.name}
              </span>
              <span className="bg-yellow/90 absolute right-0 -bottom-1 left-0 mx-auto h-[1px] w-0 duration-200 group-hover:w-[85%] group-hover:duration-300" />
            </div>
          </Link>
        ))}
      </nav>
      <Separator orientation="horizontal" className="text-white" />
      <div className="flex justify-center text-white">
        © 2025 ReceiptIQ. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
