import { Controller, Get, Post, Put, Delete, Param, Body} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { UserService } from 'src/user/user.service';
import { Recipe } from './recipe.entity';
import { User } from 'src/user/user.entity';

@Controller('recipe')
export class RecipeController {
    constructor(
    private recipeService: RecipeService,
    private userService: UserService,
  ) {}

  @Post()
  async create(@Body() body: any) {
    const { userId, name, instructions, thumbnail, ingredients } = body;

    // Fetch user
    const user: User | null = await this.userService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const recipeData = { name, instructions, thumbnail, ingredients };
    return this.recipeService.create(recipeData, user);
  }

  @Get()
  async findAll() {
    return this.recipeService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.recipeService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    return this.recipeService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.recipeService.remove(id);
  }

  @Get('search/:name')
  async findByName(@Param('name') name: string) {
    return this.recipeService.findByName(name);
  }
}
