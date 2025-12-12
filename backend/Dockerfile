FROM node:20-slim

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci --only=production

# アプリケーションコードをコピー
COPY . .

# ポートを公開（Cloud RunはPORT環境変数を使用）
ENV PORT=8080
EXPOSE 8080

# アプリケーションを起動
CMD ["node", "server.js"]

