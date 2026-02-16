FROM node:22-alpine

WORKDIR /app

# Copy test package files and install shared deps
COPY tests/package.json package-lock.json* ./
RUN npm install

# Copy agent package files and install agent deps
COPY agents/vercel-ai-sdk/package.json agents/vercel-ai-sdk/
RUN cd agents/vercel-ai-sdk && npm install

# Copy source files
COPY tools/ tools/
COPY agents/vercel-ai-sdk/ agents/vercel-ai-sdk/
COPY tests/shared/ tests/shared/

CMD ["./node_modules/.bin/tsx", "agents/vercel-ai-sdk/test.mts"]
