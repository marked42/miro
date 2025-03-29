"use client"

import React from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { Authenticated, AuthLoading, ConvexReactClient } from 'convex/react'
import { Loading } from "@/components/auth/loading";

interface ConvexClientProviderProps {
    children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!
const convex = new ConvexReactClient(convexUrl)

export default function ConvexClientProvider({ children }: ConvexClientProviderProps) {
    return (
        <ClerkProvider publishableKey="pk_test_ZXhwZXJ0LWFyYWNobmlkLTcxLmNsZXJrLmFjY291bnRzLmRldiQ">
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                <Authenticated>
                    {children}
                </Authenticated>
                <AuthLoading>
                    <Loading />
                </AuthLoading>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}
