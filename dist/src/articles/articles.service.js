"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
let ArticlesService = class ArticlesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10, search, category) {
        const skip = (page - 1) * limit;
        const where = {
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
    async findMyArticles(userId) {
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
    async findBySlug(slug) {
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
        if (!article)
            throw new common_1.NotFoundException("Article not found");
        return article;
    }
    async create(authorId, dto) {
        try {
            return await this.prisma.article.create({
                data: { ...dto, authorId },
                include: {
                    author: { select: { id: true, name: true, avatar: true } },
                    category: true,
                },
            });
        }
        catch (e) {
            if (e instanceof client_2.Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                throw new common_1.ConflictException("Статья с таким названием уже существует");
            }
            throw e;
        }
    }
    async update(id, userId, userRole, dto) {
        const article = await this.prisma.article.findUnique({ where: { id } });
        if (!article)
            throw new common_1.NotFoundException("Article not found");
        if (article.authorId !== userId && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException("You are not allowed to edit this article");
        }
        const data = {};
        if (dto.title !== undefined)
            data.title = dto.title;
        if (dto.slug !== undefined)
            data.slug = dto.slug;
        if (dto.content !== undefined)
            data.content = dto.content;
        if (dto.categoryId !== undefined)
            data.categoryId = dto.categoryId;
        if (dto.published !== undefined)
            data.published = dto.published;
        if (dto.imageUrl !== undefined)
            data.imageUrl = dto.imageUrl;
        try {
            return await this.prisma.article.update({
                where: { id },
                data,
                include: {
                    author: { select: { id: true, name: true, avatar: true } },
                    category: true,
                },
            });
        }
        catch (e) {
            if (e instanceof client_2.Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                throw new common_1.ConflictException("Статья с таким названием уже существует");
            }
            throw e;
        }
    }
    async remove(id, userId, userRole) {
        const article = await this.prisma.article.findUnique({ where: { id } });
        if (!article)
            throw new common_1.NotFoundException("Article not found");
        if (article.authorId !== userId && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException("You are not allowed to delete this article");
        }
        await this.prisma.article.delete({ where: { id } });
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map