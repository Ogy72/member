import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({ context }) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({ to: "/sign-in" })
        }
    },
    component: AuthenticatedLayout,
});
