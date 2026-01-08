import { useCallback, useEffect, useState } from "react";
import * as api from "./auth";
import type { User } from "./auth";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function useAuth() {
    const [status, setStatus] = useState<AuthStatus>("loading");
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>("");

    const refresh = useCallback(async () => {
        setError("");
        setStatus("loading");
        try {
            const u = await api.me();
            if (u) {
                setUser(u);
                setStatus("authenticated");
            } else {
                setUser(null);
                setStatus("unauthenticated");
            }
        } catch (e) {
            setUser(null);
            setStatus("unauthenticated");
            setError(e instanceof Error ? e.message : "unknown error");
        }
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        setError("");
        try {
            const u = await api.login(email, password);
            setUser(u);
            setStatus("authenticated");
            return true;
        } catch (e) {
            setUser(null);
            setStatus("unauthenticated");
            setError(e instanceof Error ? e.message : "unknown error");
            return false;
        }
    }, []);

    const signUp = useCallback(
        async (name: string, email: string, password: string) => {
            setError("");
            try {
                const u = await api.signup(name, email, password);
                setUser(u);
                setStatus("authenticated");
                return true;
            } catch (e) {
                setUser(null);
                setStatus("unauthenticated");
                setError(e instanceof Error ? e.message : "unknown error");
                return false;
            }
        },
        []
    );

    const signOut = useCallback(async () => {
        setError("");
        try {
            await api.logout();
        } finally {
            // logout が失敗しても、ローカル状態は未ログインに倒す（挫折防止）
            setUser(null);
            setStatus("unauthenticated");
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { status, user, error, refresh, signIn, signUp, signOut };
}
