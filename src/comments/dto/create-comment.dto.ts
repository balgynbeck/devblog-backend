import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'uuid-of-article' })
  @IsUUID()
  articleId: string;

  @ApiProperty({ example: 'Great article!' })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
}
