"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Clock3,
  LogOut,
  MessageSquarePlus,
  Settings,
  UserRound,
} from "lucide-react";

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
import { authClient } from "@/src/lib/auth-client";
import InputTextBar from "@/components/userInputBar/InputTextBar";

type User={
  name: string;
  email: string;
  image?: string | null | undefined;
};

type Conversations= {
  _id: string;
  userId: string;
  title: string;
};

type Message = {
  _id: string;
  content: string;
  role: "user" | "model";
};

type ChatWorkspaceProps = {
  user: User;
  conversations: Conversations[];
  activeConversationTitle?: string;
  messages?: Message[];
};

export default function ChatWorkspace({
  user,
  conversations,
  activeConversationTitle,
  messages = [],
}: ChatWorkspaceProps) {
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(messages);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleMessages(messages);
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [visibleMessages]);


  const initials = user.name
    .split(/\s+/)
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
    <SidebarProvider className="h-[calc(100svh-4rem)] min-h-0 bg-zinc-900 text-white">
      <Sidebar collapsible="offcanvas" className="top-16 h-[calc(100svh-4rem)]">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/chat" />}
                size="lg"
                tooltip="New chat"
              >
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
                  {/* //..dynamic link btn */}
                  {conversations.map((data) =>(
                    <SidebarMenuButton key={data._id} render={<Link href={`/chat/${data._id}`}/> }>
                    <span>{data.title}</span>
                  </SidebarMenuButton>
                  ))}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup></SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="text-white">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="#settings" />}
                tooltip="Settings"
              >
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
                  <p className="truncate text-sm font-medium text-[#f7f1e8]">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-[#9f968b]">
                    {user.email}
                  </p>
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

      <SidebarInset className="h-full overflow-hidden bg-[#11100f] text-[#f7f1e8]">
        <header className="flex h-12 shrink-0 items-center border-b border-white/10 px-3">
          <SidebarTrigger
            aria-label="Toggle sidebar"
            className="text-[#bcb4a9] hover:bg-white/5 hover:text-[#f7f1e8]"
          />
          <span className="ml-2 truncate text-sm text-[#9f968b]">
            {activeConversationTitle ?? "New conversation"}
          </span>
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 sm:px-8">
          {activeConversationTitle || visibleMessages.length > 0 ? (
            <div
              ref={messagesContainerRef}
              className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-6 overflow-y-auto overscroll-contain scrollbar-none scroll-smooth py-8 pb-12"
            >
              {visibleMessages.map((message) => (
                <div
                  key={message._id}
                  className={
                    message.role === "user" ? "flex justify-end" : "w-full"
                  }
                >
                  <p
                    className={
                      message.role === "user"
                        ? "max-w-[85%] whitespace-pre-wrap wrap-break-word rounded-2xl bg-[#f4b860] px-4 py-3 text-[#211a12] sm:max-w-[75%]"
                        : "w-full whitespace-pre-wrap wrap-break-word py-1 leading-7 text-[#f7f1e8]"
                    }
                  >
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <p className="text-sm text-[#9f968b]">
                Start a new conversation with Lumina.
              </p>
            </div>
          )}
        </main>
        <InputTextBar
          onMessageAdded={(message) =>
            setVisibleMessages((current: any) => [...current, message])
          }
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
