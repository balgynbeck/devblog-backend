FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY src ./src/

RUN npm run build && ls -la dist/

EXPOSE 3001

CMD npx prisma migrate deploy && node dist/main
