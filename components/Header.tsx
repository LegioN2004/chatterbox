'use client'

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation"
import { Button } from "./ui/button";

const Header = () => {

    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard")

  return (
        <header className="flex items-center justify-between px-4 h-15 sm:px-6 ">
            <Link href="/dashboard" className="font-semibold uppercase tracking-widest text-lzg"> Chatterbox </Link>
            <div className="flex items-center gap-2">
                {/* convex button that checks first if the user is authenticated/logged in on clerk or not then checks again with convex and it makes sure that we're fully authenticated and show everything */}
                <Authenticated>
                    {!isDashboard && (
                        <Link href="/dashboard" >
                        <Button variant="outline">Dashboard</Button>
                        </Link>
                    )}
                    <UserButton />
                </Authenticated>
                <Unauthenticated>
                    <SignInButton
                    mode="modal"
                    forceRedirectUrl="/dashboard"
                    signUpForceRedirectUrl="/dashboard"
                    >
                        <Button variant="outline">Sign in</Button>
                    </SignInButton>
                </Unauthenticated>
            </div>
        </header>
    )
}

export default Header