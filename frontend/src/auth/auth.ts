import { apiFetch, ApiError } from "../lib/api";

export type User = {
    id: number;
    name: string;
    email: string;
};

let csrfPromise: Promise<void> | null = null;

async function csrf(): Promise<void> {
    // Sanctum Cookie認証でPOSTを安定させるため、毎回csrf-cookieを取りに行く（安定優先）
    if (!csrfPromise) {
        csrfPromise = apiFetch<void>("/sanctum/csrf-cookie", {
            method: "GET",
        }).catch((e) => {
            // 失敗したら次回リトライできるように戻す
            csrfPromise = null;
            throw e;
        });
    }
    await csrfPromise;
}

// 419 が出たら 1 回だけ csrf を取り直して再実行する
async function withCsrfRetry<T>(fn: () => Promise<T>): Promise<T> {
    try {
        await csrf();
        return await fn();
    } catch (e: any) {
        if (e instanceof ApiError && e.status === 419) {
            csrfPromise = null;
            await csrf();
            return await fn();
        }
        throw e;
    }
}

/** ログイン */
export async function login(email: string, password: string): Promise<User> {
    return withCsrfRetry(async () => {
        const res = await apiFetch<{ ok: boolean; user: User }>(
            "/api/v1/auth/login",
            {
                method: "POST",
                json: { email, password },
            }
        );
        return res.user;
    });
}

/** サインアップ */
export async function signup(
    name: string,
    email: string,
    password: string
): Promise<User> {
    return withCsrfRetry(async () => {
        const res = await apiFetch<{ ok: boolean; user: User }>(
            "/api/v1/auth/signup",
            {
                method: "POST",
                json: { name, email, password },
            }
        );
        return res.user;
    });
}

/** ログアウト */
export async function logout(): Promise<void> {
    await withCsrfRetry(async () => {
        await apiFetch("/api/v1/auth/logout", { method: "POST" });
    });
}

/** 自分情報（未ログインは null） */
export async function me(): Promise<User | null> {
    try {
        const res = await apiFetch<{ ok: boolean; user: User }>("/api/v1/me", {
            method: "GET",
            headers: { Accept: "application/json" },
        });
        return res.user;
    } catch (e: any) {
        // 未ログインは null 扱い
        if (e?.status === 401) return null;
        throw e;
    }
}
