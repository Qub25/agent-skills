FROM node:22-alpine

WORKDIR /app

# Copy test package files and install shared deps
COPY tests/package.json package-lock.json* ./
RUN npm install

# Copy agent package files and install agent deps
COPY agents/langchain/package.json agents/langchain/
RUN cd agents/langchain && npm install

# Copy source files
COPY tools/ tools/
COPY agents/langchain/ agents/langchain/
COPY tests/shared/ tests/shared/

CMD ["./node_modules/.bin/tsx", "agents/langchain/test.mts"]
