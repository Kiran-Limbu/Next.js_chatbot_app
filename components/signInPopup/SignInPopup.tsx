"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { LogIn, X } from "lucide-react";

import { authClient } from "@/src/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPopup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    setIsLoading(false);
    if (signInError) setError(signInError.message ?? "Unable to sign in.");
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
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-[#11100f] px-4 py-10 text-[#f7f1e8]">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="sign-in-popup-title"
        className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#1a1816] p-6 shadow-2xl shadow-black/40"
      >
        <Button
          render={<Link href="/" />}
          variant="ghost"
          size="icon"
          aria-label="Close sign in popup"
          className="absolute right-4 top-4 text-[#bcb4a9] hover:bg-white/10 hover:text-[#f7f1e8]"
        >
          <X />
        </Button>

        <div className="pr-10">
          <h1 id="sign-in-popup-title" className="text-xl font-semibold">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-[#9f968b]">
            Welcome back to Lumina.
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

        <form onSubmit={handleEmailSignIn} className="space-y-3">
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
            {isLoading ? "Signing in..." : "Sign in with email"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-[#9f968b]">
          Need an account?{" "}
          <Button
            render={<Link href="/" />}
            variant="link"
            className="h-auto p-0 text-[#f4b860] hover:text-[#f7ca82]"
          >
            Sign up
          </Button>
        </p>
      </section>
    </main>
  );
}