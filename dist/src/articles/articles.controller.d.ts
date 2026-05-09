import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
export declare class ArticlesController {
    private articlesService;
    constructor(articlesService: ArticlesService);
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
    findMy(req: any): Promise<({
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
    findOne(slug: string): Promise<{
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
    create(req: any, dto: CreateArticleDto): Promise<{
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
    update(id: string, req: any, dto: UpdateArticleDto): Promise<{
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
    remove(id: string, req: any): Promise<void>;
}
