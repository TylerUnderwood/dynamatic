FROM php:7.3-fpm

RUN apt-get update && apt-get install -y --no-install-recommends \
	libmagickwand-dev \
	libjpeg62-turbo-dev \
	libpng-dev \
	zlib1g-dev \
	libzip-dev \
	&& pecl install imagick-beta \
	&& rm -rf /var/lib/apt/lists/* \
	&& docker-php-ext-configure gd --with-jpeg-dir=/usr/include/ \
	&& docker-php-ext-install -j$(nproc) gd \
	&& docker-php-ext-install exif \
	&& docker-php-ext-install zip \
	&& docker-php-ext-enable imagick




CMD [ "php-fpm" ]

WORKDIR /var/www/html

EXPOSE 9000
