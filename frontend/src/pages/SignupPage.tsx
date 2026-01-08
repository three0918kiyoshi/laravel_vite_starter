import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function SignupPage() {
    const { error, signUp } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("New User");
    const [email, setEmail] = useState(`user${Date.now()}@example.com`);
    const [password, setPassword] = useState("Password123!");
    const [busy, setBusy] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        try {
            const ok = await signUp(name, email, password);
            if (ok) navigate("/app", { replace: true });
        } finally {
            setBusy(false);
        }
    };

    return (
        <div style={{ padding: 24, maxWidth: 520 }}>
            <h1>Sign up</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
                <label>
                    Name
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </label>

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
                    {busy ? "Creating..." : "Create account"}
                </button>
            </form>

            <p style={{ marginTop: 12 }}>
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
}
