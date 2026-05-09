import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateArticleDto {
  @ApiProperty({ example: "My First Article" })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: "my-first-article" })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "slug must be lowercase alphanumeric with hyphens",
  })
  slug: string;

  @ApiProperty({ example: "Full article content here..." })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({ example: "https://example.com/image.png" })
  @IsOptional()
  @IsUrl({}, { message: "imageUrl must be a URL address" })
  imageUrl?: string; // пустая строка → undefined через transform

  @ApiProperty({ example: "uuid-of-category" })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  published: boolean;
}
