import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function LoginPage() {
    const { status, error, signIn } = useAuth();

    const [email, setEmail] = useState("test1@example.com");
    const [password, setPassword] = useState("Password123!");
    const [busy, setBusy] = useState(false);

    const navigate = useNavigate();
    const location = useLocation() as { state?: { from?: string } };
    const from = location.state?.from || "/app";

    useEffect(() => {
        if (status === "authenticated" && location.state?.from) {
            navigate(from, { replace: true });
        }
    }, [from, location.state?.from, navigate, status]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (busy) return; // 二重送信ガード
        setBusy(true);
        try {
            const ok = await signIn(email, password);
            if (ok) navigate(from, { replace: true });
        } finally {
            setBusy(false);
        }
    };

    return (
        <div style={{ padding: 24, maxWidth: 520 }}>
            <h1>Login</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
                <label>
                    Email
                    <input
                        data-testid="login-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </label>

                <label>
                    Password
                    <input
                        data-testid="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </label>

                <button
                    data-testid="login-submit"
                    type="submit"
                    disabled={busy}
                >
                    {busy ? "Logging in..." : "Login"}
                </button>
            </form>

            <p style={{ marginTop: 12 }}>
                New here? <Link to="/signup">Create an account</Link>
            </p>
        </div>
    );
}
