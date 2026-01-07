import { useState } from "react";

function getCookie(name: string) {
    const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return m ? decodeURIComponent(m[2]) : "";
}

export default function App() {
    const [email, setEmail] = useState("test1@example.com");
    const [password, setPassword] = useState("Password123!");
    const [me, setMe] = useState<any>(null);
    const [msg, setMsg] = useState<string>("");

    const csrf = async () => {
        await fetch("/sanctum/csrf-cookie", { credentials: "include" });
        setMsg("CSRF cookie set");
    };

    const login = async () => {
        setMsg("");
        // 1) CSRF cookie
        await csrf();

        // 2) XSRF-TOKEN をヘッダに載せる（fetchは自動でやらない）
        const xsrf = getCookie("XSRF-TOKEN");

        const res = await fetch("/api/v1/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": xsrf,
            },
            body: JSON.stringify({ email, password }),
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
            setMsg(`login failed: HTTP ${res.status} ${JSON.stringify(json)}`);
            return;
        }
        setMsg("login ok");
    };

    const fetchMe = async () => {
        const res = await fetch("/api/v1/me", { credentials: "include" });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
            setMsg(`me failed: HTTP ${res.status} ${JSON.stringify(json)}`);
            return;
        }
        setMe(json);
        setMsg("me ok");
    };

    const logout = async () => {
        await csrf();
        const xsrf = getCookie("XSRF-TOKEN");

        const res = await fetch("/api/v1/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: { "X-XSRF-TOKEN": xsrf },
        });

        if (!res.ok) {
            setMsg(`logout failed: HTTP ${res.status}`);
            return;
        }
        setMe(null);
        setMsg("logout ok");
    };

    return (
        <div style={{ padding: 24, maxWidth: 520 }}>
            <h1>Sanctum Cookie Auth Test</h1>

            <div style={{ display: "grid", gap: 8 }}>
                <label>
                    email
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </label>
                <label>
                    password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </label>

                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={login}>login</button>
                    <button onClick={fetchMe}>me</button>
                    <button onClick={logout}>logout</button>
                </div>

                {msg && <p>{msg}</p>}
                {me && <pre>{JSON.stringify(me, null, 2)}</pre>}
            </div>
        </div>
    );
}
