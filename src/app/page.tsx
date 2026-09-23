import Link from "next/link";
import { Clock3, LogIn, MessageSquarePlus, Settings } from "lucide-react";

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

export default function Home() {
  return (
    <SidebarProvider className="min-h-[calc(100svh-4rem)] bg-zinc-900 text-white">
      <Sidebar collapsible="offcanvas" className="top-16 h-[calc(100svh-4rem)] ">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="#new-chat" />}
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
            <SidebarGroupLabel  className="text-white font-semibold">Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link href="#recent" />} tooltip="Recent chats">
                    <Clock3 />
                    <span>Recent chats</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="text-white">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="#login" />} tooltip="Log in">
                <LogIn />
                <span>Log in</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="#settings" />} tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
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
