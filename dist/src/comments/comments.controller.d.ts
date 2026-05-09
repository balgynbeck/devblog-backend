import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsController {
    private commentsService;
    constructor(commentsService: CommentsService);
    create(req: any, dto: CreateCommentDto): Promise<{
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
    remove(id: string, req: any): Promise<void>;
}
