import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import LoginPage from "./pages/LoginPage";
import AppPage from "./pages/AppPage";
import SignupPage from "./pages/SignupPage";
import RequireAuth from "./routes/RequireAuth";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/app" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    <Route element={<RequireAuth />}>
                        <Route path="/app" element={<AppPage />} />
                    </Route>

                    <Route
                        path="*"
                        element={<div style={{ padding: 24 }}>Not Found</div>}
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
