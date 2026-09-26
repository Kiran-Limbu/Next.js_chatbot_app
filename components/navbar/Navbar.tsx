
import Link from "next/link";
import { LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

const Navbar = async () => {

      const session = await auth.api.getSession({ headers: await headers() });
      console.log(session);

  
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#11100f]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Lumina home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#f4b860] text-[#211a12] shadow-[0_0_24px_rgba(244,184,96,0.18)] transition-transform group-hover:rotate-6">
            <Sparkles className="size-4" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight text-[#f7f1e8]">
            Lumina
          </span>
        </Link>

        {session ? (
          <span className="border-white/15 font-semibold bg-transparent text-[#f7f1e8]"> {`Hi : ${session?.user?.name}`}</span>
        ) : ( <Button
         nativeButton={false}
            type="button"
            variant="outline"
            size="sm"
            render={<Link href="/signin" />}
            className="border-white/15 bg-transparent text-[#f7f1e8] hover:border-[#f4b860]/60 hover:bg-[#f4b860]/10 hover:text-[#f4b860]"
          >
            <LogIn />
            Log in
          </Button>)}
         
        </div>
      </header>
    </>
  );
};

export default Navbar;
