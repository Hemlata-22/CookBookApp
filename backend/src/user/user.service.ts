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

  //create a new user in database
  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepo.create(userData); 
    return this.userRepo.save(user); 
  }

  //find user by email(for login/auth)
  async findByEmail(email: string):Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  //find user by id
  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  //Add a recipe to user's favourites
  async addFavorite(userId: number, recipeId: number): Promise<User> {
     // User ko DB se fetch karna, saath hi favoriteRecipes relation load karna
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favoriteRecipes'],
    });
    if (!user) throw new Error('User not found');

     // Recipe fetch karna
    const recipe = await this.recipeRepo.findOneBy({ id: recipeId });
    if (!recipe) throw new Error('Recipe not found');

    // Agar favorites list empty hai, to initialize kar do
    if (!user.favoriteRecipes) user.favoriteRecipes = [];

    // Duplicate check - agar recipe already favorite hai
    if (user.favoriteRecipes.find(r => r.id === recipe.id))
      throw new Error('Recipe already in favorites');

     // Recipe add karna favorites me
    user.favoriteRecipes.push(recipe);
    // DB me update/save karna
    return this.userRepo.save(user);
  }

  //Remove a recipe from user's favorites
  async removeFavorite(userId: number, recipeId: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favoriteRecipes'],
    });
    if (!user) throw new Error('User not found');

    // Filter karke remove karna
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

    // Return user's favorite recipes
    return user.favoriteRecipes;
  }

}
