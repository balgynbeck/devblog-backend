FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN npm install --production
RUN npx prisma generate

EXPOSE 3001

CMD npx prisma migrate deploy && node dist/main
