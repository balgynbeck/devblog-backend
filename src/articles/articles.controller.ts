import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("articles")
@Controller("articles")
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: "Get paginated list of published articles" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "category", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "Returns paginated published articles",
  })
  findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search?: string,
    @Query("category") category?: string,
  ) {
    return this.articlesService.findAll(+page, +limit, search, category);
  }

  // ВАЖНО: /my/list должен быть ДО /:slug иначе NestJS думает что "my" это slug
  @Get("my/list")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get my articles including drafts (authenticated)" })
  @ApiResponse({
    status: 200,
    description: "Returns all articles by current user",
  })
  findMy(@Request() req) {
    return this.articlesService.findMyArticles(req.user.id);
  }

  @Get(":slug")
  @ApiOperation({ summary: "Get single article by slug" })
  @ApiParam({ name: "slug", type: String })
  @ApiResponse({
    status: 200,
    description: "Returns full article with relations",
  })
  @ApiResponse({ status: 404, description: "Article not found" })
  findOne(@Param("slug") slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new article (authenticated)" })
  @ApiResponse({ status: 201, description: "Article created" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create(@Request() req, @Body() dto: CreateArticleDto) {
    return this.articlesService.create(req.user.id, dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update article (author or ADMIN only)" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Article updated" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Article not found" })
  update(
    @Param("id") id: string,
    @Request() req,
    @Body() dto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, req.user.id, req.user.role, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete article (author or ADMIN only)" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 204, description: "Article deleted" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Article not found" })
  remove(@Param("id") id: string, @Request() req) {
    return this.articlesService.remove(id, req.user.id, req.user.role);
  }
}
