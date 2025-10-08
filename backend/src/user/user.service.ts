import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Recipe } from 'src/recipe/recipe.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Recipe) private recipeRepo: Repository<Recipe>,
  ) {}

  //create a new user
  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepo.create(userData); 
    return this.userRepo.save(user); 
  }

  //find user by email
  async findByEmail(email: string):Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  //fin user by id
  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  //Add a recipe to user's favourites
  async addFavorite(userId: number, recipeId: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favoriteRecipes'],
    });
    if (!user) throw new Error('User not found');

    const recipe = await this.recipeRepo.findOneBy({ id: recipeId });
    if (!recipe) throw new Error('Recipe not found');

    if (!user.favoriteRecipes) user.favoriteRecipes = [];
    if (user.favoriteRecipes.find(r => r.id === recipe.id))
      throw new Error('Recipe already in favorites');

    user.favoriteRecipes.push(recipe);
    return this.userRepo.save(user);
  }

  //Remove a recipe from user's favorites
  async removeFavorite(userId: number, recipeId: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favoriteRecipes'],
    });
    if (!user) throw new Error('User not found');

    user.favoriteRecipes = user.favoriteRecipes.filter(r => r.id !== recipeId);
    return this.userRepo.save(user);
  }

  //Get all favorites recipes of a user
  async getFavorites(userId: number): Promise<Recipe[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favoriteRecipes'],
    });
    if (!user) throw new Error('User not found');

    return user.favoriteRecipes;
  }

}
