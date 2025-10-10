import { Controller, Get, Post, Put, Delete, Param, Body,Query} from '@nestjs/common';
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

  //create a new recipe
  @Post()
  async create(@Body() body: any) {
    const { userId, name, instructions, thumbnail, ingredients } = body;

    // Fetch user from db
    const user: User | null = await this.userService.findById(userId);
    if (!user) {
      throw new Error('User not found'); //agr user exist bhi krta
    }

    const recipeData = { name, instructions, thumbnail, ingredients };
    //Recipe create krne k liye  service call
    return this.recipeService.create(recipeData, user);
  }

  //get all recipes
  @Get()
  async findAll() {
    //service se saare recipe fetch krte hai
    return this.recipeService.findAll();
  }

  // suggest recipe from Forkify API
  @Get('search/suggest')
  async suggest(@Query('q') q: string){  //@Query('q'): Forkify requires a query parameter (often q) — we accept q from the frontend query string and pass it to the service
    // q query parameter frontend se aata hai
    return this.recipeService.suggestFromForkify(q);
  }

  // Get recipe by ID
  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.recipeService.findById(id);
  }

  //Update recipe
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    return this.recipeService.update(id, body);
  }

  //Delete recipe
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.recipeService.remove(id);
  }

  //Search recipe by name
  @Get('search/:name')
  async findByName(@Param('name') name: string) {
    return this.recipeService.findByName(name);
  }

  

}
