import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401 })
  getMe(@Request() req) {
    return req.user;
  }

  @Patch("me")
  @ApiOperation({ summary: "Update current user profile (name, avatar)" })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401 })
  updateMe(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @Delete("me")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete current user account" })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 401 })
  deleteMe(@Request() req) {
    return this.usersService.remove(req.user.id);
  }
}
