import React, { createContext, useContext, useEffect } from "react";
import { useAuth as useAuthImpl } from "./useAuth";

type AuthContextValue = ReturnType<typeof useAuthImpl>;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const auth = useAuthImpl();

    useEffect(() => {
        const safeRefresh = () => {
            // refresh が例外を投げてもアプリ全体を落とさない
            Promise.resolve(auth.refresh()).catch(() => {});
        };

        const onPageShow = (e: PageTransitionEvent) => {
            if (e.persisted) safeRefresh();
        };

        const onVisibility = () => {
            if (!document.hidden) safeRefresh();
        };

        window.addEventListener("pageshow", onPageShow);
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            window.removeEventListener("pageshow", onPageShow);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [auth]);

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
