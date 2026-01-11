import { test, expect } from "@playwright/test";

const EMAIL = "test1@example.com";
const PASS = "Password123!";

function isApiUrl(url: string) {
    return url.includes("/api/");
}

async function attachApiGuard(page: any) {
    page.on("response", async (res: any) => {
        const url = res.url();
        if (!isApiUrl(url)) return;

        const status = res.status();
        // 未ログイン確認で401は普通に出るので許容
        if (status >= 400 && status !== 401) {
            const body = await res.text().catch(() => "");
            throw new Error(`API error ${status} url=${url}\n${body}`);
        }
    });
}

test("login/logout/refresh/back を雑に連打しても壊れない", async ({
    page,
    context,
}) => {
    await attachApiGuard(page);

    // Cookie肥大で400になるのを避ける
    await context.clearCookies();

    // /login へ
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login/);

    // ★ まず「ログインフォームが描画される」ことを待つ（ここがないとタイムアウト地獄）
    const email = page.getByTestId("login-email");
    const pass = page.getByTestId("login-password");
    const submit = page.getByTestId("login-submit");

    // 画面が壊れている時はここで止まるので、原因が明確になる
    await expect(email).toBeVisible({ timeout: 20_000 });
    await expect(pass).toBeVisible({ timeout: 20_000 });
    await expect(submit).toBeVisible({ timeout: 20_000 });

    // 2) ログイン（クリック連打）
    await email.fill(EMAIL);
    await pass.fill(PASS);

    await Promise.all([submit.click(), submit.click()]);

    // /app へ
    await page.waitForURL(/\/app/, { timeout: 20_000 });
    await expect(page).toHaveURL(/\/app/);

    // 3) refresh を連打
    for (let i = 0; i < 3; i++) {
        await page.reload({ waitUntil: "domcontentloaded" });
        await expect(page).toHaveURL(/\/app/);
    }

    // 4) 履歴を作って戻る/進む
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login/);

    await page.goBack({ waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/app/);

    await page.goForward({ waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login/);

    // 5) 再ログイン（ここで壊れるなら確実に検知できる）
    await expect(email).toBeVisible({ timeout: 20_000 });
    await pass.fill(PASS);
    await submit.click();
    await page.waitForURL(/\/app/, { timeout: 20_000 });

    // 6) ログアウト連打（logoutボタンがある前提）
    const logout = page.getByTestId("logout-button");
    await expect(logout).toBeVisible({ timeout: 20_000 });

    await Promise.all([logout.click(), logout.click()]);

    // 7) /app に行くと弾かれて /login に戻る想定
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login/);

    await expect(submit).toBeVisible({ timeout: 20_000 });
});
