import { Controller, Post, Delete, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

  @Post(':userId/favorites/:recipeId')
  async addFavorite(@Param('userId') userId: number, @Param('recipeId') recipeId: number) {
    return this.userService.addFavorite(userId, recipeId);
  }

  @Delete(':userId/favorites/:recipeId')
  async removeFavorite(@Param('userId') userId: number, @Param('recipeId') recipeId: number) {
    return this.userService.removeFavorite(userId, recipeId);
  }

  @Get(':userId/favorites')
  async getFavorites(@Param('userId') userId: number) {
    return this.userService.getFavorites(userId);
  }
}
