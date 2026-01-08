import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function LoginPage() {
    const { status, error, signIn } = useAuth();
    const [email, setEmail] = useState("test1@example.com");
    const [password, setPassword] = useState("Password123!");
    const [busy, setBusy] = useState(false);

    const navigate = useNavigate();
    const location = useLocation() as any;
    const from = location?.state?.from || "/app";

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        try {
            const ok = await signIn(email, password);
            if (ok) navigate(from, { replace: true });
        } finally {
            setBusy(false);
        }
    };

    if (status === "authenticated") {
        // すでにログイン済みなら保護ページへ
        navigate("/app", { replace: true });
    }

    return (
        <div style={{ padding: 24, maxWidth: 520 }}>
            <h1>Login</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
                <label>
                    Email
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </label>

                <button type="submit" disabled={busy}>
                    {busy ? "Logging in..." : "Login"}
                </button>
            </form>

            <p style={{ marginTop: 12 }}>
                New here? <Link to="/signup">Create an account</Link>
            </p>
        </div>
    );
}
