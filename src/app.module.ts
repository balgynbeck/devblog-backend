import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ArticlesModule } from "./articles/articles.module";
import { CategoriesModule } from "./categories/categories.module";
import { CommentsModule } from "./comments/comments.module";
import { UploadModule } from "./upload/upload.module";
import { AppController } from "./app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ArticlesModule,
    CategoriesModule,
    CommentsModule,
    UploadModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
