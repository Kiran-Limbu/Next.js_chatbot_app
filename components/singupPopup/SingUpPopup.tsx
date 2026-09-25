"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { LogIn, X } from "lucide-react";

import { authClient } from "@/src/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthPopupProps = {
  open: boolean;
  onClose: () => void;
};

export default function SingUpPopup({ open, onClose }: AuthPopupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleEmailSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/",
    });

    setIsLoading(false);
    if (signUpError) setError(signUpError.message ?? "Unable to sign up.");
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    const { error: signInError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (signInError) {
      setIsLoading(false);
      setError(signInError.message ?? "Unable to continue with Google.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm transition-all"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-popup-title"
        className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#1a1816] p-6 text-[#f7f1e8] shadow-2xl shadow-black/40"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close login popup"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#bcb4a9] hover:bg-white/10 hover:text-[#f7f1e8]"
        >
          <X />
        </Button>

        <div className="pr-10">
          <h2 id="auth-popup-title" className="text-xl font-semibold">
            Sign up
          </h2>
          <p className="mt-2 text-sm text-[#9f968b]">
            Continue your conversation with Lumina.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          className="mt-6 h-11 w-full border-white/15 bg-white/5 text-[#f7f1e8] hover:bg-white/10 hover:text-white"
        >
          Continue with Google
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs text-[#81786f]">
          <span className="h-px flex-1 bg-white/10" />
          OR
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleEmailSignUp} className="space-y-3">
          <Input
            type="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter Name"
            autoComplete="name"
            required
            className="h-11 border-white/15 bg-white/5 text-[#f7f1e8] placeholder:text-[#81786f]"
          />
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            autoComplete="email"
            required
            className="h-11 border-white/15 bg-white/5 text-[#f7f1e8] placeholder:text-[#81786f]"
          />
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="h-11 border-white/15 bg-white/5 text-[#f7f1e8] placeholder:text-[#81786f]"
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full bg-[#f4b860] text-[#211a12] hover:bg-[#f7ca82]"
          >
            <LogIn />
            {isLoading ? "Signing up..." : "Sign up with email"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-[#9f968b]">
          Already have an account?{" "}
          <Button
            render={<Link href="/singIn" />}
            variant="link"
            className="h-auto p-0 text-[#f4b860] hover:text-[#f7ca82]"
          >
            Sign in
          </Button>
        </p>
      </section>
    </div>
  );
}
