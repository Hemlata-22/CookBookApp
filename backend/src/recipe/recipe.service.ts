import { Injectable, HttpException,HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { User } from 'src/user/user.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RecipeService {
    constructor(
    @InjectRepository(Recipe) private recipeRepo: Repository<Recipe>,
    private readonly httpService: HttpService,
  ) {}

  // Create a new recipe
  async create(recipeData: Partial<Recipe>, user: User): Promise<Recipe> {
    const recipe = this.recipeRepo.create({
      ...recipeData,
      postedBy: user, // link recipe to user
      postedAt: new Date(),//current date/time set kr rahe hai
    });
    return this.recipeRepo.save(recipe);//DB m save krna
  }

  // Get all recipes
  async findAll(): Promise<Recipe[]> {
    return this.recipeRepo.find({
      relations: ['postedBy'], // sath hi user info bhi fetch kr rhae hai
      order: { postedAt: 'DESC' },//Latest recipe first
    });
  }

  // Get recipe by ID
  async findById(id: number): Promise<Recipe | null> {
    return this.recipeRepo.findOne({
      where: { id },
      relations: ['postedBy'],//include user info
    });
  }

  // Update recipe
  async update(id: number, updateData: Partial<Recipe>): Promise<Recipe> {
  const recipe = await this.recipeRepo.findOne({ where: { id } });
  if (!recipe) {
    throw new Error('Recipe not found'); // handle error if recipe doesn't exist
  }

  Object.assign(recipe, updateData); // update recipe fields
  return this.recipeRepo.save(recipe); // save and return updated recipe
}

  // Delete recipe
  async remove(id: number): Promise<{ message: string }> {
    await this.recipeRepo.delete(id);//Delete from DB
    return { message: 'Recipe deleted successfully' };
  }

  // Find recipes by name (search)
  async findByName(name: string): Promise<Recipe[]> {
    return this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.postedBy', 'user')//Include user info
      .where('recipe.name ILIKE :name', { name: `%${name}%` }) // case-insensitive search
      .getMany();
  }

  // it suggest recipes from Forkify API (proxy)
  async suggestFromForkify(query: string): Promise<any[]> {
    if (!query || query.trim().length === 0) return [];

    const url = `https://forkify-api.herokuapp.com/api/search?q=${encodeURIComponent(query)}`;

    try {
      // HttpService Observable return karta hai, lastValueFrom se promise banate hain
      const response = await lastValueFrom(this.httpService.get(url, { timeout: 5000 }));
      const data = response.data;

      // Forkify's structure (common): { count: N, recipes: [ { recipe_id, title, image_url, publisher, ... } ] }
      const recipes = Array.isArray(data.recipes) ? data.recipes : [];

      // Light weight object banake frontend ke liye return karte hain
      return recipes.map((r: any) => ({
        id: r.recipe_id,
        title: r.title,
        image: r.image_url,
        publisher: r.publisher,
        source_url: r.source_url,
      }));
    } catch (err: any) {
      // Log the error server-side (optional)
      console.error('Forkify API error:', err?.message || err);

      // External API error ko client ke liye HTTP exception ke through throw karte hain
      throw new HttpException(
        { message: 'Failed to fetch suggestions from external API' },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
