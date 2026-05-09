FROM node:20-alpine

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем все зависимости (включая dev для сборки)
RUN npm install

# Копируем исходники
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Собираем проект
RUN npm run build

# Открываем порт
EXPOSE 3001

# Запускаем: миграции + сервер
CMD npx prisma migrate deploy && npm run start:prod
