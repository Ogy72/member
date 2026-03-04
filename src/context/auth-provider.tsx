import { useEffect, useState } from "react"
import { AuthContext } from "@/context/auth-context";
import { authClient } from "@/lib/auth-client"
import { api } from "@/lib/api.ts"
import {tokenStore} from "@/lib/token-store.ts";
import type { User } from "@/features/auth/types.ts";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [initialized, setInitialized] = useState(false);

    // Init Session On App Load
    useEffect(() => {
        async function init() {

            try {
                const token = await authClient.refresh();

                if (!token) throw new Error();

                const { data } = await api.get("/members/me");
                setUser(data);
            } catch {
                tokenStore.clear();
                setUser(null);
            } finally {
                setInitialized(true);
            }
        }

        void init()
    }, []);

    // Login Function
    async function login(email: string, password: string) {
        const user = await authClient.login(email, password);
        setUser(user);
    }

    // Logout Function
    async function logout() {
        try {
            await authClient.logout();
        } catch {
            // Keep local auth state consistent even if server logout fails.
            tokenStore.clear();
        } finally {
            setUser(null);
        }
    }

    if (!initialized) return null;

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
