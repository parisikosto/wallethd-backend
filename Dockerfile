FROM node:24.12.0-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY src ./src

RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

ENV NODE_ENV=production

USER appuser

EXPOSE 5000

CMD ["node", "src/index.js"]
