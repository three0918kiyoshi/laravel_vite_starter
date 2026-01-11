import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "./auth";
import type { User } from "./auth";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function useAuth() {
    const [status, setStatus] = useState<AuthStatus>("loading");
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>("");

    // ★ refreshの多重実行を潰す（pageshow/visibilitychange等で連打されても1回にする）
    const refreshPromiseRef = useRef<Promise<void> | null>(null);

    const refresh = useCallback((): Promise<void> => {
        if (refreshPromiseRef.current) return refreshPromiseRef.current;

        refreshPromiseRef.current = (async () => {
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
            } catch (e: any) {
                // ここでthrowするとアプリ全体が落ちがちなので、未ログインに倒して終わる
                setUser(null);
                setStatus("unauthenticated");
                setError(e instanceof Error ? e.message : "unknown error");
            } finally {
                refreshPromiseRef.current = null;
            }
        })();

        return refreshPromiseRef.current;
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
        } catch (e) {
            // サーバ側logoutが失敗しても、ローカル状態は未ログインに倒す（挫折防止）
        } finally {
            setUser(null);
            setStatus("unauthenticated");
        }
    }, []);

    // 初回ロードで一回だけ me を確認
    useEffect(() => {
        refresh();
    }, [refresh]);

    return { status, user, error, refresh, signIn, signUp, signOut };
}
