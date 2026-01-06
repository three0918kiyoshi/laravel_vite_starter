FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git unzip zip curl \
    libzip-dev \
    libonig-dev \
    libpng-dev \
    default-mysql-client \
  && docker-php-ext-install pdo_mysql mbstring zip \
  && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY ./docker/backend/php.ini /usr/local/etc/php/php.ini

WORKDIR /var/www/backend
CMD ["php-fpm"]
