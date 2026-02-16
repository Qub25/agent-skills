FROM node:22-alpine

WORKDIR /app

# Copy test package files and install shared deps
COPY tests/package.json package-lock.json* ./
RUN npm install

# Copy agent package files and install agent deps
COPY agents/opencode/package.json agents/opencode/
RUN cd agents/opencode && npm install

# Copy source files
COPY tools/ tools/
COPY agents/opencode/ agents/opencode/
COPY tests/shared/ tests/shared/

CMD ["./node_modules/.bin/tsx", "agents/opencode/test.mts"]
