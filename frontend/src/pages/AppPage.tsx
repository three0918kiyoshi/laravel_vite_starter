import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function AppPage() {
    const { user, signOut, refresh, error } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ padding: 24, maxWidth: 720 }}>
            <h1>Protected /app</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <p>
                Logged in as: <b>{user?.name}</b> ({user?.email})
            </p>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={refresh}>Refresh (me)</button>
                <button
                    onClick={async () => {
                        await signOut();
                        navigate("/login", { replace: true });
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
