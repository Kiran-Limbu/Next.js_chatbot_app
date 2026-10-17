"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Clock3,
  Ellipsis,
  LogOut,
  MessageSquarePlus,
  Settings,
  UserRound,
} from "lucide-react";
import { Dialog } from "@base-ui/react/dialog";
import { usePathname } from "next/navigation";

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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { authClient } from "@/src/lib/auth-client";
import InputTextBar from "@/components/userInputBar/InputTextBar";

type User = {
  name: string;
  email: string;
  image?: string | null | undefined;
};

type Conversations = {
  _id: string;
  userId: string;
  title: string;
};

type Message = {
  _id: string;
  content: string;
  role: "user" | "model";
};

const EMPTY_MESSAGES: Message[] = [];

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
  messages = EMPTY_MESSAGES,
}: ChatWorkspaceProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState<
    string | null
  >(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [conversationToDelete, setConversationToDelete] =
    useState<Conversations | null>(null);
  const [visibleMessages, setVisibleMessages] = useState(messages);
  const [previousMessages, setPreviousMessages] = useState(messages);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  if (messages !== previousMessages) {
    setPreviousMessages(messages);
    setVisibleMessages(messages);
  }

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [visibleMessages]);

  const initials = user.name.split(/\s+/).join("").slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient.signOut();
    router.replace("/");
    router.refresh();
  };

  const handleDeleteConversation = async (conversationId: string) => {
    setDeletingConversationId(conversationId);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/chat/${conversationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message ?? "Failed to delete conversation");
      }

      if (pathname === `/chat/${conversationId}`) {
        router.replace("/chat");
      }
      router.refresh();
    } catch (error) {
      console.error("Delete conversation error:", error);
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to delete conversation",
      );
    } finally {
      setDeletingConversationId(null);
    }
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
              <SidebarGroupLabel className="space-x-2.5 text-white">
                <Clock3 />
                <span>Recent chats</span>
              </SidebarGroupLabel>
              <SidebarMenu>
                {conversations.map((data) => (
                  <SidebarMenuItem key={data._id}>
                    <SidebarMenuButton
                      render={<Link href={`/chat/${data._id}`} />}
                    >
                      <span>{data.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      showOnHover
                      aria-label={`Delete ${data.title}`}
                      disabled={deletingConversationId === data._id}
                      onClick={() => setConversationToDelete(data)}
                    >
                      <Ellipsis aria-hidden="true" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              {deleteError && (
                <p role="alert" className="px-2 py-2 text-xs text-red-400">
                  {deleteError}
                </p>
              )}
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
            setVisibleMessages((current) => [...current, message])
          }
        />
      </SidebarInset>
      <Dialog.Root
        open={conversationToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setConversationToDelete(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-[#1b1917] p-5 text-[#f7f1e8] shadow-xl outline-none">
            <Dialog.Title className="text-base font-semibold">
              Delete chat?
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-[#bcb4a9]">
              This will permanently delete &quot;
              {conversationToDelete?.title}&quot;. This can&apos;t be undone.
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setConversationToDelete(null);
                  router.replace("/chat");
                }}
                className="rounded-md border border-white/15 px-3 py-2 text-sm hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingConversationId === conversationToDelete?._id}
                onClick={() => {
                  if (conversationToDelete) {
                    void handleDeleteConversation(conversationToDelete._id);
                    setConversationToDelete(null);
                  }
                }}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingConversationId === conversationToDelete?._id
                  ? "Deleting..."
                  : "Delete chat"}
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </SidebarProvider>
  );
}
