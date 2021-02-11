FROM nginx:alpine

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/site.conf /etc/nginx/sites-available/site.conf

WORKDIR /var/www/html

CMD [ "nginx" ]

EXPOSE 80 443
