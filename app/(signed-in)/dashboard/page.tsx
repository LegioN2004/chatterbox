'use client' // highly interactive app karne

import { useSidebar } from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/router";
import { useChatContext } from "stream-chat-react";


const Dashboard = () => {
    // user object from clerk ofc
    const { user, isLoaded } = useUser();
    const router = useRouter();
    // for using the 
    const { channel, setActiveChannel } = useChatContext();
    const { setOpen } = useSidebar();

  return (
    <div>Dashboard main</div>
  )
}

export default Dashboard