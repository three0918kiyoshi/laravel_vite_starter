export type User = {
    id: number;
    name: string;
    email: string;
};

export type MeResponse = { ok: boolean; user: User };

function getCookie(name: string) {
    const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return m ? decodeURIComponent(m[2]) : "";
}

/** CSRF cookie を取得（Sanctum SPAの必須ステップ） */
export async function csrf(): Promise<void> {
    await fetch("/sanctum/csrf-cookie", { credentials: "include" });
}

/** ログイン */
export async function login(email: string, password: string): Promise<User> {
    await csrf();
    const xsrf = getCookie("XSRF-TOKEN");

    const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-XSRF-TOKEN": xsrf,
        },
        body: JSON.stringify({ email, password }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(
            `login failed: HTTP ${res.status} ${JSON.stringify(json)}`
        );
    }

    // { ok: true, user: ... } を想定
    return json.user as User;
}

/** ログアウト */
export async function logout(): Promise<void> {
    await csrf();
    const xsrf = getCookie("XSRF-TOKEN");

    const res = await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-XSRF-TOKEN": xsrf,
        },
    });

    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(
            `logout failed: HTTP ${res.status} ${JSON.stringify(json)}`
        );
    }
}

/** 自分情報取得（未ログインなら null を返す） */
export async function me(): Promise<User | null> {
    const res = await fetch("/api/v1/me", {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    if (res.status === 401) return null;

    const json = (await res.json().catch(() => ({}))) as Partial<MeResponse>;
    if (!res.ok) {
        throw new Error(
            `me failed: HTTP ${res.status} ${JSON.stringify(json)}`
        );
    }

    return (json.user ?? null) as User | null;
}

export async function signup(
    name: string,
    email: string,
    password: string
): Promise<User> {
    // いったんユーザー作成（ここは現状のサインアップAPIを使う）
    const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: password,
        }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(
            `signup failed: HTTP ${res.status} ${JSON.stringify(json)}`
        );
    }

    // signup後は自動ログイン（Cookie認証なので login を呼ぶのが一番確実）
    return await login(email, password);
}
