export type ApiFieldErrors = Record<string, string[]>;

export class ApiError extends Error {
    status: number;
    payload: any;
    fieldErrors?: ApiFieldErrors;

    constructor(
        status: number,
        message: string,
        payload: any,
        fieldErrors?: ApiFieldErrors
    ) {
        super(message);
        this.status = status;
        this.payload = payload;
        this.fieldErrors = fieldErrors;
    }
}

async function parseJsonSafe(res: Response) {
    const text = await res.text().catch(() => "");
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return { raw: text };
    }
}

function getCookie(name: string) {
    const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return m ? decodeURIComponent(m[2]) : "";
}

/** 共通fetch（JSON前提） */
export async function apiFetch<T>(
    path: string,
    init: RequestInit & { json?: any } = {}
): Promise<T> {
    const headers = new Headers(init.headers);

    headers.set("Accept", "application/json");
    headers.set("X-Requested-With", "XMLHttpRequest");

    if (init.json !== undefined) {
        headers.set("Content-Type", "application/json");
    }

    // Sanctum CSRF（必要なときだけ送る）
    if (
        ["POST", "PUT", "PATCH", "DELETE"].includes(
            (init.method || "GET").toUpperCase()
        )
    ) {
        const xsrf = getCookie("XSRF-TOKEN");
        if (xsrf) headers.set("X-XSRF-TOKEN", xsrf);
    }

    const res = await fetch(path, {
        ...init,
        credentials: "include",
        headers,
        body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
    });

    if (res.ok) {
        // 204 もあり得る
        if (res.status === 204) return null as T;
        return (await parseJsonSafe(res)) as T;
    }

    const payload = await parseJsonSafe(res);

    // 422: Laravel validation errors
    const fieldErrors =
        res.status === 422 ? (payload?.errors as ApiFieldErrors) : undefined;

    const message = payload?.message || `API error: HTTP ${res.status}`;

    throw new ApiError(res.status, message, payload, fieldErrors);
}
