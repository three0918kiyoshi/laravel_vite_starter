<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogoutController extends Controller
{
    public function __invoke(Request $request)
    {
        // web ガードのログアウト（セッションを切る）
        Auth::guard('web')->logout();

        // セッション破棄 + CSRFトークン再生成
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        $response = response()->json(['ok' => true]);

        $sessionCookie = config('session.cookie');
        $sessionPath = config('session.path', '/');
        $sessionDomain = config('session.domain');

        $response->withCookie(
            cookie()->forget($sessionCookie, $sessionPath, $sessionDomain)
        );
        if ($sessionCookie !== 'laravel_session') {
            $response->withCookie(
                cookie()->forget('laravel_session', $sessionPath, $sessionDomain)
            );
        }
        $response->withCookie(
            cookie()->forget('XSRF-TOKEN', $sessionPath, $sessionDomain)
        );
        $response->withCookie(cookie()->forget($sessionCookie));
        $response->withCookie(cookie()->forget('XSRF-TOKEN'));

        return $response;
    }
}
