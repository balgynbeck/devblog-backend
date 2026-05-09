import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getMe(req: any): any;
    updateMe(req: any, dto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        avatar: string | null;
        createdAt: Date;
    }>;
    deleteMe(req: any): Promise<void>;
}
