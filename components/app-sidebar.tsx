import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { UserButton, useUser } from "@clerk/nextjs"
import { ChannelList } from "stream-chat-react"
import { ChannelFilters, ChannelSort } from "stream-chat"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { user } = useUser();

  // filters to check for channels that the user is a member of
  // yaad rakhna broooooooooooo
  const filters: ChannelFilters = {
    members: { $in: [user?.id || ""] }, // checks if the user is a member of the channel
    type: { $in: ["messaging", "team"] }, // only get messaging and team channels
  };

  const options = { state: true, presence: true }; // to get the state and presence of the channels
  const sort: ChannelSort = { last_message_at: -1 }; // sort by last message at descending order, so last message top t thakibo

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Welcome back
                  </span>
                  <span className="text-sm font-semibold">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <UserButton signInUrl="/sign-in" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <Button variant="outline" className="w-full">
              New Chat
            </Button>

            {/* channel list */}
            <ChannelList
              filters={filters}
              sort={sort}
              options={options}
              EmptyStateIndicator={() =>
                <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                  <div className="text-6xl mb-6 opacity-20">💬</div>
                  <h2 className="text-xl font-medium text-foreground mb-2">
                    Ready to chat?
                    I
                  </h2>
                  <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-[200px]">
                    Your conversations will appear here once you start chatting
                    with others.
                  </p>
                </div>
              }
            ></ChannelList>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar >
  )
}
