FROM node:20-slim

WORKDIR /app

# package.jsonをコピー
COPY package.json ./

# 依存関係をインストール（package-lock.jsonがない場合はnpm installを使用）
RUN npm install --only=production

# アプリケーションコードをコピー
COPY . .

# ポートを公開（Cloud RunはPORT環境変数を使用）
ENV PORT=8080
EXPOSE 8080

# アプリケーションを起動
CMD ["node", "server.js"]

