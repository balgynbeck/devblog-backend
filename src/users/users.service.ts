import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    const { passwordHash, ...result } = user;
    return result;
  }

  async update(id: string, dto: UpdateUserDto) {
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.avatar !== undefined) data.avatar = dto.avatar;

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { passwordHash, ...result } = user;
    return result;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");

    // 1. Удаляем комментарии пользователя
    await this.prisma.comment.deleteMany({ where: { authorId: id } });

    // 2. Находим статьи пользователя
    const articles = await this.prisma.article.findMany({
      where: { authorId: id },
      select: { id: true },
    });
    const articleIds = articles.map((a) => a.id);

    // 3. Удаляем комментарии на его статьи, потом сами статьи
    if (articleIds.length > 0) {
      await this.prisma.comment.deleteMany({
        where: { articleId: { in: articleIds } },
      });
      await this.prisma.article.deleteMany({ where: { authorId: id } });
    }

    // 4. Удаляем самого пользователя
    await this.prisma.user.delete({ where: { id } });
  }
}
