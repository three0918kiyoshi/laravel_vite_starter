import React, { createContext, useContext } from "react";
import { useAuth as useAuthImpl } from "./useAuth";

type AuthContextValue = ReturnType<typeof useAuthImpl>;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const auth = useAuthImpl();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
