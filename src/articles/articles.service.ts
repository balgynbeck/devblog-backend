import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { Role } from "@prisma/client";
import { Prisma } from "@prisma/client";

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10, search?: string, category?: string) {
    const skip = (page - 1) * limit;

    const where: any = {
      published: true,
    };

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    if (category) {
      where.category = { slug: category };
    }

    const [data, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, avatar: true },
          },
          category: true,
          _count: { select: { comments: true } },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findMyArticles(userId: string) {
    return this.prisma.article.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: true,
        _count: { select: { comments: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, createdAt: true },
        },
        category: true,
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    if (!article) throw new NotFoundException("Article not found");
    return article;
  }

  async create(authorId: string, dto: CreateArticleDto) {
    try {
      return await this.prisma.article.create({
        data: { ...dto, authorId },
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          category: true,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("Статья с таким названием уже существует");
      }
      throw e;
    }
  }

  async update(
    id: string,
    userId: string,
    userRole: Role,
    dto: UpdateArticleDto,
  ) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException("Article not found");

    if (article.authorId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException("You are not allowed to edit this article");
    }

    // Build update payload explicitly so null values clear DB columns
    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.categoryId !== undefined) data.categoryId = dto.categoryId;
    if (dto.published !== undefined) data.published = dto.published;
    // imageUrl: null explicitly clears the cover image in the DB
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;

    try {
      return await this.prisma.article.update({
        where: { id },
        data,
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          category: true,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("Статья с таким названием уже существует");
      }
      throw e;
    }
  }

  async remove(id: string, userId: string, userRole: Role) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException("Article not found");

    if (article.authorId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException(
        "You are not allowed to delete this article",
      );
    }

    await this.prisma.article.delete({ where: { id } });
  }
}
