# Laravel + React + MySQL + Vite + nginx + Docker Starter

Laravel 12 / React 19 / MySQL / Vite / nginx / Docker で開発を進めるためのスターターキットです。
フロントエンドと API を分離した構成で、最小限の認証フロー（サインアップ / ログイン / ログアウト）まで実装済みです。

## スタック

- Laravel 12
- React 19
- MySQL 8
- Vite
- nginx
- Docker / Docker Compose

## できること

- サインアップ
- ログイン
- ログアウト
- 認証状態の確認（/me 相当）

## 環境構築

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd laravel_vite_starter
```

### 2. `.env` を作成

```bash
cp backend/.env.example backend/.env
```

### 3. コンテナを起動

```bash
make up
```

### 4. 起動後にマイグレーション（必要に応じて）

```bash
make be
php artisan migrate
```

### 5. フロントエンドの依存関係

`make up` の起動時に `npm install` が自動実行されます。必要に応じて手動実行できます。

```bash
make fe
npm install
```

## 起動手順

```bash
make up
```

起動後に確認できる URL:

- http://localhost:8000 （nginx 経由のアプリ）
- http://localhost:5173 （Vite dev server）

## 開発用シェル

```bash
make be  # backend コンテナに入る
make fe  # frontend コンテナに入る
```

## テスト

### Unit / Feature (Laravel)

```bash
make be
composer test
```

### Unit (React)

```bash
make fe
npm test
```

### E2E (Playwright)

```bash
docker compose run --rm e2e
```

E2E は nginx / backend / frontend が起動している前提で実行されます。

## 停止

```bash
make down
```
