FROM node:22-alpine

WORKDIR /app

# Copy test package files and install shared deps
COPY tests/package.json package-lock.json* ./
RUN npm install

# Copy agent package files and install agent deps
COPY agents/openai/package.json agents/openai/
RUN cd agents/openai && npm install

# Copy source files
COPY tools/ tools/
COPY agents/openai/ agents/openai/
COPY tests/shared/ tests/shared/

CMD ["./node_modules/.bin/tsx", "agents/openai/test.mts"]
