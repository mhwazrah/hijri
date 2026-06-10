# Hijri Calendar — static PWA served by nginx
FROM nginx:1.27-alpine

# Serving rules (service-worker caching, gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# App assets only (no tooling / git / config)
COPY index.html manifest.json sw.js styles.css app.js /usr/share/nginx/html/
COPY icon.svg icon-192.png icon-512.png icon-maskable.png /usr/share/nginx/html/

EXPOSE 80
