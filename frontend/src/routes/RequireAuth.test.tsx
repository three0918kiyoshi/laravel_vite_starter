import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RequireAuth from "./RequireAuth";

// AuthProvider をモックする（最小）
vi.mock("../auth/AuthProvider", () => {
    return {
        useAuth: () => ({ status: "unauthenticated" }),
    };
});

describe("RequireAuth", () => {
    it("redirects to /login when unauthenticated", () => {
        const ui = render(
            <MemoryRouter initialEntries={["/app"]}>
                <Routes>
                    <Route element={<RequireAuth />}>
                        <Route path="/app" element={<div>APP</div>} />
                    </Route>
                    <Route path="/login" element={<div>LOGIN</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(ui.getByText("LOGIN")).toBeInTheDocument();
    });
});
