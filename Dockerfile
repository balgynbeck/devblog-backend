FROM node:20-slim

# Устанавливаем OpenSSL — нужен для Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD npx prisma migrate deploy && npm run start:prod