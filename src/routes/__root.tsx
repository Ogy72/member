import { type QueryClient } from '@tanstack/react-query'
import { type AuthContextType } from "@/context/auth-context.ts";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner"
import { NavigationProgress } from "@/components/navigation-progress";
import { GeneralError } from "@/features/errors/general-error"
import { NotFoundError } from "@/features/errors/not-found-error";

export interface RouterContext {
    queryClient: QueryClient
    auth: AuthContextType
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => {
        return (
            <>
                <div id="root">
                    <NavigationProgress />
                    <Outlet />
                    <Toaster duration={5000} />
                </div>
            </>
        )
    },
    notFoundComponent: NotFoundError,
    errorComponent: GeneralError,
});