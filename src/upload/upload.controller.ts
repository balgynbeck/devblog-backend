import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { memoryStorage } from "multer";

@ApiTags("upload")
@Controller("upload")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private config: ConfigService) {}

  @Post("image")
  @ApiOperation({ summary: "Загрузить изображение, возвращает URL" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: { file: { type: "string", format: "binary" } },
    },
  })
  @ApiResponse({ status: 201, description: "Возвращает { url: string }" })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
          return cb(
            new BadRequestException("Разрешены только изображения"),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Файл не предоставлен");

    const cloudName = this.config.get<string>("CLOUDINARY_CLOUD_NAME");
    const uploadPreset =
      this.config.get<string>("CLOUDINARY_UPLOAD_PRESET") || "devblog_unsigned";

    if (!cloudName) {
      throw new BadRequestException("Cloudinary не настроен");
    }

    // Unsigned upload — не требует подписи и API secret
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(file.buffer)], {
      type: file.mimetype,
    });
    formData.append("file", blob, file.originalname);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "devblog");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new BadRequestException(
        `Ошибка Cloudinary: ${(err as any)?.error?.message || response.statusText}`,
      );
    }

    const data = (await response.json()) as any;
    return { url: data.secure_url };
  }
}
