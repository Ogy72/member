import { createHttpClient } from "@/lib/http.ts"
import { tokenStore } from "@/lib/token-store"
import { authClient } from "@/lib/auth-client"

export const api = createHttpClient();

/* Request Interceptor */
api.interceptors.request.use((config) => {
    const token = tokenStore.get();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
});

/* Request Interceptor (Refresh Token) */
api.interceptors.response.use(res => res,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error)
        }

        originalRequest._retry = true

        try {
            const newToken = await authClient.refresh();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest)
        } catch {
            tokenStore.clear()
            window.location.href = "/sign-in"
            return Promise.reject(error)
        }
    }
)