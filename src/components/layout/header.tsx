"use client";
import Link from "next/link";

const Header = () => {

    return (
      <div>
        <div className="flex flex-row gap-x-12 px-36 py-4 text-lg">
          <Link href="">Financial Monitor</Link>
          <Link href="">Upload</Link>
          <Link href="">Receipts</Link>
          <Link href="">Statistics</Link>
        </div>
      </div>
    );
}

export default Header;