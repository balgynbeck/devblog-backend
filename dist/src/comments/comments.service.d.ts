import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Role } from '@prisma/client';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(authorId: string, dto: CreateCommentDto): Promise<{
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
    }>;
    remove(id: string, userId: string, userRole: Role): Promise<void>;
}
