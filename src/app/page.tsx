import HomeWorkspace from "@/components/chat/HomeWorkspace";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/chat");
  }

  return (<HomeWorkspace />);
}
