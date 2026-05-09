import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            articles: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
    })[]>;
    create(dto: CreateCategoryDto): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        name: string;
        slug: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): Promise<void>;
}
