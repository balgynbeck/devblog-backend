import { PrismaService } from "../prisma/prisma.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { Role } from "@prisma/client";
export declare class ArticlesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, search?: string, category?: string): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                slug: string;
            };
            author: {
                id: string;
                name: string;
                avatar: string;
            };
            _count: {
                comments: number;
            };
        } & {
            id: string;
            createdAt: Date;
            slug: string;
            title: string;
            content: string;
            imageUrl: string | null;
            published: boolean;
            authorId: string;
            categoryId: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findMyArticles(userId: string): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
        };
        author: {
            id: string;
            name: string;
            avatar: string;
        };
        _count: {
            comments: number;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        content: string;
        imageUrl: string | null;
        published: boolean;
        authorId: string;
        categoryId: string;
    })[]>;
    findBySlug(slug: string): Promise<{
        comments: ({
            author: {
                id: string;
                name: string;
                avatar: string;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            authorId: string;
            articleId: string;
        })[];
        category: {
            id: string;
            name: string;
            slug: string;
        };
        author: {
            id: string;
            name: string;
            avatar: string;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        content: string;
        imageUrl: string | null;
        published: boolean;
        authorId: string;
        categoryId: string;
    }>;
    create(authorId: string, dto: CreateArticleDto): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        author: {
            id: string;
            name: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        content: string;
        imageUrl: string | null;
        published: boolean;
        authorId: string;
        categoryId: string;
    }>;
    update(id: string, userId: string, userRole: Role, dto: UpdateArticleDto): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        author: {
            id: string;
            name: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        content: string;
        imageUrl: string | null;
        published: boolean;
        authorId: string;
        categoryId: string;
    }>;
    remove(id: string, userId: string, userRole: Role): Promise<void>;
}
