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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const multer_1 = require("multer");
let UploadController = class UploadController {
    constructor(config) {
        this.config = config;
    }
    async uploadImage(file) {
        if (!file)
            throw new common_1.BadRequestException("Файл не предоставлен");
        const cloudName = this.config.get("CLOUDINARY_CLOUD_NAME");
        const uploadPreset = this.config.get("CLOUDINARY_UPLOAD_PRESET") || "devblog_unsigned";
        if (!cloudName) {
            throw new common_1.BadRequestException("Cloudinary не настроен");
        }
        const formData = new FormData();
        const blob = new Blob([new Uint8Array(file.buffer)], {
            type: file.mimetype,
        });
        formData.append("file", blob, file.originalname);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", "devblog");
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new common_1.BadRequestException(`Ошибка Cloudinary: ${err?.error?.message || response.statusText}`);
        }
        const data = (await response.json());
        return { url: data.secure_url };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)("image"),
    (0, swagger_1.ApiOperation)({ summary: "Загрузить изображение, возвращает URL" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: { file: { type: "string", format: "binary" } },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Возвращает { url: string }" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_, file, cb) => {
            if (!file.mimetype.startsWith("image/")) {
                return cb(new common_1.BadRequestException("Разрешены только изображения"), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImage", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)("upload"),
    (0, common_1.Controller)("upload"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map