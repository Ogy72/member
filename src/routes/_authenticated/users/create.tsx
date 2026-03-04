import { createFileRoute } from "@tanstack/react-router"
import { UsersCreatePage } from "@/features/users/components/users-create-page"

export const Route = createFileRoute('/_authenticated/users/create')({
    component: UsersCreatePage,
})