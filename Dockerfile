# ============================================================================
# QUEEN STONE — DOCKERFILE TRIỂN KHAI INTERNET CHUẨN CLOUD
# ============================================================================
FROM node:20-slim

# Cài đặt build tools cho better-sqlite3
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Sao chép package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Sao chép toàn bộ mã nguồn
COPY . .

# Khởi tạo thư mục dữ liệu & cấp quyền
RUN mkdir -p data public/uploads

EXPOSE 8000

ENV NODE_ENV=production
ENV PORT=8000
ENV HOST=0.0.0.0

CMD ["npm", "start"]
