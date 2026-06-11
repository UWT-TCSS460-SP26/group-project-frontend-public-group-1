/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavProfileLink() {
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    setAvatar(localStorage.getItem("profileAvatar") ?? "");
  }, []);

  return (
    <Link
      href="/profile"
      className="flex items-center gap-2 text-text-secondary hover:text-text-primary font-semibold transition-colors"
    >
      {avatar && (
        <Image
          src={avatar}
          alt="Profile avatar"
          width={28}
          height={28}
          sizes="28px"
          className="h-7 w-7 rounded-full object-cover"
        />
      )}

      <span>Profile</span>
    </Link>
  );
}
