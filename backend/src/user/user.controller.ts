import { Controller, Post, Delete, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

  // Add a recipe to user's favorites list
  @Post(':userId/favorites/:recipeId')
  async addFavorite(@Param('userId') userId: number, @Param('recipeId') recipeId: number) {
    // Call service method to handle adding favorite
    return this.userService.addFavorite(userId, recipeId);
  }

  // Remove a recipe from user's favorites list
  @Delete(':userId/favorites/:recipeId')
  async removeFavorite(@Param('userId') userId: number, @Param('recipeId') recipeId: number) {
    // Call service method to handle removing favorite
    return this.userService.removeFavorite(userId, recipeId);
  }

  // Get all favorite recipes of a user
  @Get(':userId/favorites')
  async getFavorites(@Param('userId') userId: number) {
    // Call service method to fetch all favorite recipes for this user
    return this.userService.getFavorites(userId);
  }
}
