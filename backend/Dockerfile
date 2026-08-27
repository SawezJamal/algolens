FROM node:22-bookworm

# Install Python, pip and C++ compiler
RUN apt-get update \
    && apt-get install -y python3 python3-pip g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Install Python ML dependencies
RUN pip3 install --no-cache-dir \
    scikit-learn \
    numpy

# Copy backend source
COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]