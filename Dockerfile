FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./
COPY index.html ./
COPY logo.png ./
COPY styles.css ./
COPY app.js ./
COPY backend ./backend
COPY widget ./widget

RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV TECHCORP_HUB_DOMAIN=https://hesinhthai.techcorp.info.vn

EXPOSE 3000

CMD ["node", "server.js"]
