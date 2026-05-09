import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Role } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, dto: CreateCommentDto) {
    const article = await this.prisma.article.findUnique({
      where: { id: dto.articleId },
    });
    if (!article) throw new NotFoundException('Article not found');

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        authorId,
        articleId: dto.articleId,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.authorId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }

    await this.prisma.comment.delete({ where: { id } });
  }
}
