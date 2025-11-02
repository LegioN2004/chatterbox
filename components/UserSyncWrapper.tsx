'use client'

import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { useState, useCallback, useEffect } from 'react'

import LoadingSpinner from "./LoadingSpinner"
import { streamClient } from "@/lib/stream"
import { createToken } from "@/actions/createToken"

const UserSyncWrapper = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoaded: isUserLoaded } = useUser()
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // convex mutation to sync user
    const createOrUpdateUser = useMutation(api.users.upsertClerkUser);

    const syncUser = useCallback(async () => {
        if (!user?.id) return;

        try {
            setIsLoading(true);
            setError(null);

            const tokenProvider = async () => {
                if (!user?.id) throw new Error("User ID is required");

                // this is a next js server action
                const token = await createToken(user.id);
                return token;
            }

            // 1. save the user to convex
            await createOrUpdateUser({
                userId: user.id,
                name:
                    user.fullName ||
                    user.firstName ||
                    user.emailAddresses[0]?.emailAddress ||
                    "Unknown User",
                email: user.emailAddresses[0]?.emailAddress || "Unknown Email",
                imageUrl: user.imageUrl || "Unknown Image",
            });

            // 2. connect the user to stream
            await streamClient.connectUser({
                id: user.id,
                name:
                    user.fullName ||
                    user.firstName ||
                    user.emailAddresses[0]?.emailAddress ||
                    "Unknown User",
                image: user.imageUrl || "Unknown Image",
            }, tokenProvider);

        } catch (error) {
            console.error("Error syncing user data:", error);
            setError(error instanceof Error ? error.message : "Failed to sync user data.");
        } finally {
            setIsLoading(false);
        }
    }, [createOrUpdateUser, user]);

    const disconnectUser = useCallback(async () => {
        try {
            await streamClient.disconnectUser()
        } catch (error) {
            console.error("Error disconnecting user: ", error);
        }
    }, []);

    useEffect(() => {
        if (user && isUserLoaded) {
            syncUser();
        } else {
            disconnectUser();
            setIsLoading(false);
        }

        // required to run this so that any error in unmounting is caught. So if there is many mounts and unmounts, we don't have multiple users connected and leaking memory. It'll run disconnect on unmount every time.
        return () => {
            if (user) {
                disconnectUser();
            }
        }
    }, [user, isUserLoaded, syncUser, disconnectUser]);


    if (!isUserLoaded || isLoading) {
        return (
            <LoadingSpinner></LoadingSpinner>
        )
    }

    if (error) {
        return (
            <div className="flex-1 items-center justify-center bg-white px-6">
                <p className="text-red-500 text-lg font-semibold mb-2">Sync Error</p>
                <p className="text-gray-600 text-center mb-4">{error}</p>
                <p className="text-gray-500 text-sm text-center">
                    Please try restarting the app or contact support if the issue
                    persists.
                </p>
            </div>
        )
    }

    return (
        <>{children}</>
    )
}

export default UserSyncWrapper