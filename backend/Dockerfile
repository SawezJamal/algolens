FROM node:22-bookworm

# Install Python, virtual environment support and C++ compiler
RUN apt-get update \
    && apt-get install -y python3 python3-venv g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Create Python virtual environment and install ML dependencies
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir scikit-learn numpy

# Make virtual environment Python the default
ENV PATH="/opt/venv/bin:$PATH"

# Copy backend source
COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]