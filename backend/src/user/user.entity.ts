import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Recipe } from 'src/recipe/recipe.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column()
  name:string;

  @Column({ unique: true })
  email: string; 

  @Column()
  password: string;

  @Column({ default: 'user'})
  role: string;  //Role: 'user' ya 'admin'

  // Recipes created by user
  @OneToMany(() => Recipe, recipe => recipe.postedBy)
  recipes: Recipe[];

  // Favorite recipes
  @ManyToMany(() => Recipe, { cascade: true })
  @JoinTable()   // Join table banata hai User-Favorites relationship ke liye
  favoriteRecipes: Recipe[];
}
