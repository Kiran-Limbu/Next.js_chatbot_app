"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Clock3, LogOut, MessageSquarePlus, Settings, UserRound } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserInputTextBar from "@/components/userInputBar/UserInputTextBar";
import { authClient } from "@/src/lib/auth-client";

type ChatWorkspaceProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

export default function ChatWorkspace({ user }: ChatWorkspaceProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const initials = user.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient.signOut();
    router.replace("/");
    router.refresh();
  };

  return (
    <SidebarProvider className="min-h-[calc(100svh-4rem)] bg-zinc-900 text-white">
      <Sidebar collapsible="offcanvas" className="top-16 h-[calc(100svh-4rem)]">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="#new-chat" />} size="lg" tooltip="New chat">
                <MessageSquarePlus />
                <span>New chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="text-white">
          <SidebarGroup>
            <SidebarGroupLabel className="font-semibold text-white">
              Workspace
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarGroupLabel className="space-x-2.5 text-white">
                    <Clock3 />
                    <span>Recent chats</span>
                  </SidebarGroupLabel>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="text-white">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="#settings" />} tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <div className="flex min-w-0 items-center gap-3 border-t border-white/10 px-2 py-3">
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user?.image}
                    alt=""
                    className="size-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f4b860] text-sm font-semibold text-[#211a12]">
                    {initials || <UserRound className="size-4" />}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#f7f1e8]">{user.name}</p>
                  <p className="truncate text-xs text-[#9f968b]">{user.email}</p>
                </div>
                <SidebarMenuButton
                  type="button"
                  size="sm"
                  tooltip="Log out"
                  aria-label="Log out"
                  disabled={isSigningOut}
                  onClick={handleSignOut}
                  className="w-8 shrink-0 justify-center p-2"
                >
                  <LogOut />
                </SidebarMenuButton>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-[#11100f] text-[#f7f1e8]">
        <header className="flex h-12 items-center border-b border-white/10 px-4">
          <SidebarTrigger
            aria-label="Toggle sidebar"
            className="text-[#bcb4a9] hover:bg-white/5 hover:text-[#f7f1e8]"
          />
          <span className="ml-2 text-sm text-[#9f968b]">New conversation</span>
        </header>
        <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
          <p className="text-sm text-[#9f968b]">Start a new conversation with Lumina.</p>
        </main>
        <UserInputTextBar />
      </SidebarInset>
    </SidebarProvider>
  );
}