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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const { passwordHash, ...result } = user;
        return result;
    }
    async update(id, dto) {
        const data = {};
        if (dto.name !== undefined)
            data.name = dto.name;
        if (dto.avatar !== undefined)
            data.avatar = dto.avatar;
        const user = await this.prisma.user.update({
            where: { id },
            data,
        });
        const { passwordHash, ...result } = user;
        return result;
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        await this.prisma.comment.deleteMany({ where: { authorId: id } });
        const articles = await this.prisma.article.findMany({
            where: { authorId: id },
            select: { id: true },
        });
        const articleIds = articles.map((a) => a.id);
        if (articleIds.length > 0) {
            await this.prisma.comment.deleteMany({
                where: { articleId: { in: articleIds } },
            });
            await this.prisma.article.deleteMany({ where: { authorId: id } });
        }
        await this.prisma.user.delete({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map