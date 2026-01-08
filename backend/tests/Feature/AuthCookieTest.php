<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthCookieTest extends TestCase
{
    use RefreshDatabase;

    public function test_signup_then_login_me_logout_flow(): void
    {
        $email = 'test1@example.com';
        $password = 'Password123!';

        $r1 = $this->postJson('/api/v1/auth/signup', [
            'name' => 'Test User',
            'email' => $email,
            'password' => $password,
            'password_confirmation' => $password,
        ]);
        $r1->assertStatus(201);

        $r2 = $this->postJson('/api/v1/auth/login', [
            'email' => $email,
            'password' => $password,
        ]);
        $r2->assertOk();

        $r3 = $this->getJson('/api/v1/me');
        $r3->assertOk();

        $r4 = $this->postJson('/api/v1/auth/logout');
        $r4->assertOk();

        $this->getJson('/api/v1/me')->assertUnauthorized();
    }

    public function test_me_requires_auth(): void
    {
        $this->getJson('/api/v1/me')->assertUnauthorized();
    }

    public function test_login_rejects_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'x@example.com',
            'password' => bcrypt('Password123!'),
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'x@example.com',
            'password' => 'wrong',
        ])->assertStatus(422);
    }
}
