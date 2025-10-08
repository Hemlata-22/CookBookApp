import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class RecipeService {
    constructor(
    @InjectRepository(Recipe) private recipeRepo: Repository<Recipe>,
  ) {}

  // Create a new recipe
  async create(recipeData: Partial<Recipe>, user: User): Promise<Recipe> {
    const recipe = this.recipeRepo.create({
      ...recipeData,
      postedBy: user, // link recipe to user
      postedAt: new Date(),
    });
    return this.recipeRepo.save(recipe);
  }

  // Get all recipes
  async findAll(): Promise<Recipe[]> {
    return this.recipeRepo.find({
      relations: ['postedBy'], // include user info
      order: { postedAt: 'DESC' },
    });
  }

  // Get recipe by ID
  async findById(id: number): Promise<Recipe | null> {
    return this.recipeRepo.findOne({
      where: { id },
      relations: ['postedBy'],
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
    await this.recipeRepo.delete(id);
    return { message: 'Recipe deleted successfully' };
  }

  // Find recipes by name (search)
  async findByName(name: string): Promise<Recipe[]> {
    return this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.postedBy', 'user')
      .where('recipe.name ILIKE :name', { name: `%${name}%` }) // case-insensitive search
      .getMany();
  }
}
