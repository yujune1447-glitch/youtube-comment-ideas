"use client";

import { signIn } from "next-auth/react";

export function ConnectButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google")}
      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
    >
      Connect YouTube Channel
    </button>
  );
}
