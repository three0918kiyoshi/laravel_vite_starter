import { useEffect, useState } from "react";

type PingResponse = {
    ok: boolean;
    message?: string;
    ts?: string;
};

export default function App() {
    const [data, setData] = useState<PingResponse | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/v1/ping"); // ← 相対パスが重要（nginx経由で同一オリジン）
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                const json = (await res.json()) as PingResponse;
                setData(json);
            } catch (e) {
                setError(e instanceof Error ? e.message : "unknown error");
            }
        })();
    }, []);

    return (
        <div style={{ padding: 24 }}>
            <h1>Ping Test</h1>

            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
