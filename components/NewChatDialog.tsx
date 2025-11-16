'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Doc } from "@/convex/_generated/dataModel";
import useCreateNewChat from "@/hooks/useCreateNewChat";
import { useUser } from "@clerk/nextjs";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useChatContext } from "stream-chat-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import UserSearch from "./UserSearch";


const NewChatDialog = ({ children }: { children: React.ReactNode }) => {

    const [open, setOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<Doc<"users">[]>([]);
    const [groupName, setGroupName] = useState("");
    const createNewChat = useCreateNewChat();
    const { user } = useUser();
    const { setActiveChannel } = useChatContext();

    const handleSelectUser = (user: Doc<"users">) => {
        if (!selectedUsers.find((u => u._id === user._id))) {
            setSelectedUsers((prev) => [...prev, user]);
        }
    }

    const removeUser = (userId: string) => {
        setSelectedUsers((prev) => prev.filter((u) => u._id !== userId));
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen); // click anywhere it'll be closed and then the following
        if (!isOpen) {
            // reset form when dialog box closes
            setSelectedUsers([]);
            setGroupName("");
        }
    }

    const handleCreateChat = async () => {
        const totalMembers = selectedUsers.length + 1; // +1 for current user
        const isGroupChat = totalMembers > 2;

        const channel = await createNewChat({
            members: [
                user?.id as string, // user themself
                ...selectedUsers.map((u) => u.userId),
            ],
            createdBy: user?.id as string,
            groupName: isGroupChat ? groupName.trim() || undefined : undefined,
        });
        // this is very important, if we don't do that it won't know when we click on the sidebar or the specific channel that we changed anything, which means all of the internal channels won't know which channel i am in.
        setActiveChannel(channel);
        setSelectedUsers([]);
        setGroupName("");
        setOpen(false); // close the dialog after creating the chat
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Chat</DialogTitle>
                    <DialogDescription>
                        Search for users to start a conversation
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    {/* user search component */}
                    {/* selected users component */}
                    {/* group name input if more than 2 users selected */}
                    {/* create chat button */}
                    <UserSearch onSelectUser={handleSelectUser} className='w-full'></UserSearch>

                    {/* // selected users component */}
                    {selectedUsers.length > 0 && (
                        <div className="space-y-3">
                            {/* shows the number of selected users */}
                            <h4 className="text-sm font-medium text-foreground">
                                Selected Users: ({selectedUsers.length})
                            </h4>
                            {/* list of selected users with remove button */}
                            {selectedUsers.map((user) => (
                                // key required here to avoid react key error
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between p-2 bg-muted/50 border border-border rounded-lg"
                                >
                                    {/* this div contains row of user info and remove button */}
                                    <div className="flex items-center space-x-2">
                                        <Image
                                            src={user.imageUrl}
                                            alt={user.name}
                                            width={24}
                                            height={24}
                                            className="h-6 w-6 rounded-full object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeUser(user._id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                    >
                                        <XIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* group name input for group chats */}
                    {selectedUsers.length > 1 && (
                        <div className="space-y-2">
                            <label
                                htmlFor="groupName"
                                className="text-sm font-medium text-foreground"
                            >
                                Group Name (optional)
                            </label>
                            <Input
                                id="groupName"
                                type="text"
                                placeholder="Enter a name for your new group chat ...."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="w-full"
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave this empty to use a default name: &quot;Group Chat ({selectedUsers.length + 1} members)&quot;.
                            </p>
                        </div>
                    )}
                </div>
                {/* we have the dialog footer, where we have the button to create or cancel the chat */}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={selectedUsers.length === 0}
                        onClick={handleCreateChat}
                    >
                        {selectedUsers.length > 1
                            ? `Create Group Chat (${selectedUsers.length + 1} members)`
                            : selectedUsers.length === 1
                                ? "Start Chat"
                                : "Create Chat"
                        }
                    </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default NewChatDialog