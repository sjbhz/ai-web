FROM 127.0.0.1:5000/library/bcnginx:v1.20.2
LABEL maintainer="erised"
COPY dist /apps/svr/nginx-1.20.2/html/
COPY nginx.conf /apps/conf/nginx_80/nginx.conf