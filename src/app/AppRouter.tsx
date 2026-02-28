import { RouterProvider } from "@tanstack/react-router"
import { useAuth } from "@/context/use-auth.ts"
import { router } from "@/app/router";

export function AppRouter() {
    const auth = useAuth();

    return (
        <RouterProvider
            router={router}
            context={{ auth }}
        />
    )
}