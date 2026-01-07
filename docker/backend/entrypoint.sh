#!/bin/sh
set -e

cd /var/www/backend

# 必須ディレクトリを必ず作る（volume対策）
mkdir -p \
  storage/framework/views \
  storage/framework/cache \
  storage/framework/sessions \
  bootstrap/cache

# 権限をLaravel用に揃える
chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache

# vendor が無ければ自動で composer install
if [ ! -d vendor ]; then
  echo "vendor not found, running composer install..."
  composer install --no-interaction
fi

exec "$@"
