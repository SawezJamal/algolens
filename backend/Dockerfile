FROM node:22-bookworm

# Install Python and C++ compiler
RUN apt-get update \
    && apt-get install -y python3 g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]