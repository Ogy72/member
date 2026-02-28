import { createRouter } from "@tanstack/react-router"
import { queryClient } from "@/app/query-client"

// Generated Routes
import { routeTree } from '@/routeTree.gen'

export const router = createRouter({
    routeTree,
    context: {
        queryClient,
        auth: undefined!
    },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}