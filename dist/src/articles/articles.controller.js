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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const articles_service_1 = require("./articles.service");
const create_article_dto_1 = require("./dto/create-article.dto");
const update_article_dto_1 = require("./dto/update-article.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ArticlesController = class ArticlesController {
    constructor(articlesService) {
        this.articlesService = articlesService;
    }
    findAll(page = 1, limit = 10, search, category) {
        return this.articlesService.findAll(+page, +limit, search, category);
    }
    findMy(req) {
        return this.articlesService.findMyArticles(req.user.id);
    }
    findOne(slug) {
        return this.articlesService.findBySlug(slug);
    }
    create(req, dto) {
        return this.articlesService.create(req.user.id, dto);
    }
    update(id, req, dto) {
        return this.articlesService.update(id, req.user.id, req.user.role, dto);
    }
    remove(id, req) {
        return this.articlesService.remove(id, req.user.id, req.user.role);
    }
};
exports.ArticlesController = ArticlesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get paginated list of published articles" }),
    (0, swagger_1.ApiQuery)({ name: "page", required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: "search", required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: "category", required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns paginated published articles",
    }),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __param(3, (0, common_1.Query)("category")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("my/list"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get my articles including drafts (authenticated)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns all articles by current user",
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findMy", null);
__decorate([
    (0, common_1.Get)(":slug"),
    (0, swagger_1.ApiOperation)({ summary: "Get single article by slug" }),
    (0, swagger_1.ApiParam)({ name: "slug", type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns full article with relations",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Article not found" }),
    __param(0, (0, common_1.Param)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: "Create a new article (authenticated)" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Article created" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_article_dto_1.CreateArticleDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Update article (author or ADMIN only)" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Article updated" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Article not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_article_dto_1.UpdateArticleDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: "Delete article (author or ADMIN only)" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 204, description: "Article deleted" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Article not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "remove", null);
exports.ArticlesController = ArticlesController = __decorate([
    (0, swagger_1.ApiTags)("articles"),
    (0, common_1.Controller)("articles"),
    __metadata("design:paramtypes", [articles_service_1.ArticlesService])
], ArticlesController);
//# sourceMappingURL=articles.controller.js.map