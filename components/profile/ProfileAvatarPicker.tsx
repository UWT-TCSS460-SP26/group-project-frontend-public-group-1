"use client";

import Image from "next/image";
import { useState } from "react";

const avatars = [
  "/avatars/avatar-1.png",
  "/avatars/avatar-2.png",
  "/avatars/avatar-3.png",
  "/avatars/avatar-4.png",
];

type ProfileAvatarPickerProps = {
  initial: string;
};

export default function ProfileAvatarPicker({
  initial,
}: ProfileAvatarPickerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return localStorage.getItem("profileAvatar") ?? "";
  });

  function handleSelectAvatar(avatar: string) {
    setSelectedAvatar(avatar);
    localStorage.setItem("profileAvatar", avatar);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-24 w-24 overflow-hidden rounded-full bg-linear-to-br from-brand-blue to-purple-600 flex items-center justify-center text-4xl font-black shadow-lg">
        {selectedAvatar ? (
          <Image
            src={selectedAvatar}
            alt="Selected avatar"
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {avatars.map((avatar) => (
          <button
            key={avatar}
            type="button"
            onClick={() => handleSelectAvatar(avatar)}
            className={`h-10 w-10 overflow-hidden rounded-full border-2 transition ${
              selectedAvatar === avatar
                ? "border-brand-blue scale-110"
                : "border-border hover:border-text-muted"
            }`}
          >
            <Image
              src={avatar}
              alt="Avatar option"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}