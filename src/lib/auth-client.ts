import { authApi } from "@/lib/auth-api.ts"
import { tokenStore } from "@/lib/token-store"

export const authClient = {
    async login(email: string, password: string) {
        const { data } = await authApi.post("/auth/login", {
            email,
            password,
        });

        tokenStore.set(data.accessToken);

        return data.user;
    },

    async refresh() {
        const { data } = await authApi.post("/auth/refresh");
        tokenStore.set(data.accessToken);
        return data.accessToken;
    },

    async logout() {
        await authApi.post("/auth/logout");
        tokenStore.clear();
    }
}