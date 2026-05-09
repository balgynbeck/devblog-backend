# DevBlog Backend

REST API для платформы **DevBlog** — блога для разработчиков.

**Стек:** NestJS 10 · Prisma ORM · PostgreSQL · Passport.js · JWT · Swagger · Cloudinary

> 📖 **Swagger UI:** [http://localhost:3001/api/docs](http://localhost:3001/api/docs)  
> 🔗 **Live API:** [https://devblog-api.onrender.com/api/docs](https://devblog-api.onrender.com/api/docs)

---

## 🚀 Локальный запуск

### 1. Установить зависимости
```bash
npm install
```

### 2. Настроить переменные окружения
```bash
cp .env.example .env
```

Заполнить `.env`:
```env
DATABASE_URL=postgresql://postgres:1234@localhost:5432/devblog
JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d
PORT=3001
CORS_ORIGIN=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=devblog_unsigned
```

### 3. Запустить PostgreSQL

Через Docker:
```bash
docker run -d \
  --name devblog-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=devblog \
  -p 5432:5432 \
  postgres:15
```

Или использовать локально установленный PostgreSQL.

### 4. Применить миграции
```bash
npx prisma migrate dev --name init
```

### 5. Заполнить базу тестовыми данными
```bash
npm run prisma:seed
```

Seed создаёт:
- **Admin:** `admin@devblog.com` / `admin123`
- **User:** `user@devblog.com` / `user123`
- 5 категорий, 8 статей, 10 комментариев

### 6. Запустить сервер
```bash
# Разработка (с hot reload)
npm run start:dev

# Продакшн
npm run build && npm run start:prod
```

Сервер: [http://localhost:3001](http://localhost:3001)  
Swagger: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

## 📁 Структура проекта

```
src/
├── app.module.ts          — корневой модуль
├── main.ts                — точка входа, Swagger, CORS, ValidationPipe
├── auth/                  — аутентификация
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── local.strategy.ts
│   ├── jwt-auth.guard.ts
│   ├── roles.guard.ts
│   └── dto/
├── users/                 — пользователи
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
├── articles/              — статьи
│   ├── articles.controller.ts
│   ├── articles.service.ts
│   └── dto/
├── categories/            — категории
├── comments/              — комментарии
├── upload/                — загрузка изображений (Cloudinary)
└── prisma/                — сервис подключения к БД

prisma/
├── schema.prisma          — схема БД
├── migrations/            — SQL-миграции
└── seed.ts                — тестовые данные
```

---

## 🗄 Схема базы данных

| Модель | Описание |
|--------|----------|
| `User` | Пользователь (USER / ADMIN), хранит хеш пароля |
| `Article` | Статья с поддержкой черновиков, slug, обложкой |
| `Category` | Категория статей (Backend, Frontend, DevOps...) |
| `Comment` | Комментарий к статье |
| `Tag` | Тег — связь многие-ко-многим с Article |

Связи: `User` → `Article` → `Comment`, `Article` → `Category`, `Article` ↔ `Tag`  
Индексы: `Article.slug`, `Article.authorId`, `Article.categoryId`

---

## 🔌 API Endpoints

### Auth
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/register` | Регистрация нового пользователя |
| POST | `/api/auth/login` | Вход, возвращает JWT |

### Users
| Метод | Путь | Auth | Описание |
|-------|------|------|----------|
| GET | `/api/users/me` | JWT | Получить свой профиль |
| PATCH | `/api/users/me` | JWT | Обновить имя / аватар |
| DELETE | `/api/users/me` | JWT | Удалить аккаунт |

### Articles
| Метод | Путь | Auth | Описание |
|-------|------|------|----------|
| GET | `/api/articles` | — | Список статей (пагинация, поиск, фильтр) |
| POST | `/api/articles` | JWT | Создать статью |
| GET | `/api/articles/my/list` | JWT | Мои статьи (включая черновики) |
| GET | `/api/articles/:slug` | — | Получить статью по slug |
| PATCH | `/api/articles/:id` | JWT | Обновить статью (автор или ADMIN) |
| DELETE | `/api/articles/:id` | JWT | Удалить статью (автор или ADMIN) |

### Categories
| Метод | Путь | Auth | Описание |
|-------|------|------|----------|
| GET | `/api/categories` | — | Все категории |
| POST | `/api/categories` | ADMIN | Создать категорию |
| DELETE | `/api/categories/:id` | ADMIN | Удалить категорию |

### Comments
| Метод | Путь | Auth | Описание |
|-------|------|------|----------|
| POST | `/api/comments` | JWT | Оставить комментарий |
| DELETE | `/api/comments/:id` | JWT | Удалить комментарий (свой или ADMIN) |

### Upload
| Метод | Путь | Auth | Описание |
|-------|------|------|----------|
| POST | `/api/upload/image` | JWT | Загрузить изображение → возвращает URL |

---

## 🔐 Аутентификация

Используется **Passport.js** + **JWT**:

1. `POST /api/auth/login` возвращает `{ access_token: "..." }`
2. Токен передаётся в заголовке: `Authorization: Bearer <token>`
3. Приватные маршруты защищены `JwtAuthGuard`
4. Пароли хранятся в виде bcrypt-хеша (`saltRounds: 10`)

---

## ☁️ Деплой на Render

1. Создать новый **Web Service** на [render.com](https://render.com)
2. Подключить GitHub-репозиторий
3. Build command:
   ```bash
   npm install && npm run build && npx prisma migrate deploy
   ```
4. Start command:
   ```bash
   npm run start:prod
   ```
5. Добавить все переменные из `.env.example` в Render Dashboard
6. После деплоя запустить seed через Shell в Render:
   ```bash
   npx ts-node prisma/seed.ts
   ```

> ⚠️ `CORS_ORIGIN` должен содержать URL вашего Vercel-фронтенда:  
> `CORS_ORIGIN=https://devblog.vercel.app`

---

## 🤖 AI-инструменты

В разработке использовались:
- **Claude (Anthropic)** — генерация модулей, отладка, архитектурные решения
- **GitHub Copilot** — автодополнение кода

Весь код проверен, понят и адаптирован автором.
