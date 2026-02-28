import { createContext } from "react";
import type { User } from "@/features/auth/types";

export interface AuthContextType {
    user: User | null,
    isAuthenticated: boolean,
    login: (email: string, password: string) => Promise<void>,
    logout: () => void,
}

export const AuthContext = createContext<AuthContextType | null>(null);