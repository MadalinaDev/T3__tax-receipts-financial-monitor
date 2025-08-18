"use client";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { FiLinkedin, FiGithub, FiMail } from "react-icons/fi";

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
    <footer className="bg-navy-blue py-4 text-white">
      <nav className="mx-auto mb-6 flex max-w-[1580px] flex-col items-center justify-center gap-2 md:gap-4 md:flex-row md:gap-8 md:gap-36">
        {footerLinks.map((link) => (
          <Link key={link.name} href={link.path}>
            <div className="group relative">
              <span className="group-hover:text-yellow/90 duration-200 group-hover:duration-300">
                {link.name}
              </span>
              <span className="bg-yellow/90 absolute right-0 -bottom-1 left-0 mx-auto h-[1px] w-0 duration-200 group-hover:w-[85%] group-hover:duration-300" />
            </div>
          </Link>
        ))}
      </nav>
      <Separator className="mx-auto mb-4 bg-white/10 px-8 md:px-36" />
      <div className="text-center">
        <h3 className="text-md font-semibold">Built by Madalina Chirpicinic</h3>
        <h5 className="my-2 text-sm/4 text-white/80 px-2">
          Passionate full-stack developer creating innovative solutions <br /> across
          diverse technologies and industries.
        </h5>
        <div className="mt-3 flex items-center justify-center gap-x-4">
          <button className="rounded-full border-2 border-white/60 p-1 text-white/60 duration-400 hover:border-white hover:text-white">
            <a href="https://github.com/MadalinaDev">
              <FiGithub className="size-6" />
            </a>
          </button>
          <button className="rounded-full border-2 border-white/60 p-1 text-white/60 duration-400 hover:border-white hover:text-white">
            <a href="https://www.linkedin.com/in/madalina-chirpicinic/">
              <FiLinkedin className="size-6" />
            </a>
          </button>
          <button className="rounded-full border-2 border-white/60 p-1 text-white/60 duration-400 hover:border-white hover:text-white">
            <a href="mailto:madalina.chirpicinic@gmail.com">
              <FiMail className="size-6" />
            </a>
          </button>
        </div>
      </div>
      <Separator className="mx-auto my-4 bg-white/10 px-8 md:px-36" />
      <div className="flex justify-center text-white">
        © 2025 ReceiptIQ. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
