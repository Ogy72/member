export type UserRole = "admin" | "member"

export type User = {
    id: string,
    name: string,
    email: string,
    role: UserRole,
}

export type LoginPayload = {
    email: string,
    password: string,
}

export type AuthResponse = {
    accessToken: string
}