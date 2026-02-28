import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/app/query-client"
import { DirectionProvider } from "@/context/direction-provider"
import { FontProvider } from "@/context/font-provider"
import { ThemeProvider } from "@/context/theme-provider"
import {AuthProvider} from "@/context/auth-provider"
import { AppRouter } from "@/app/AppRouter.tsx";

// Styles
import '@/styles/index.css'

// Render The App
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <FontProvider>
                        <DirectionProvider>
                            <AuthProvider>
                                <AppRouter />
                            </AuthProvider>
                        </DirectionProvider>
                    </FontProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </StrictMode>,
    )
}
