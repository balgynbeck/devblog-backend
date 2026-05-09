import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "Jane Doe" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    example: "https://example.com/avatar.png",
    nullable: true,
    description: "Pass null or empty string to remove the avatar",
  })
  @IsOptional()
  @Transform(({ value }) => (value === "" ? null : value))
  avatar?: string | null;
}
