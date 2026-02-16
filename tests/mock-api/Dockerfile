FROM node:22-alpine

WORKDIR /app
COPY tests/mock-api/server.mjs .

EXPOSE 3000
HEALTHCHECK --interval=2s --timeout=2s --retries=5 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "server.mjs"]
