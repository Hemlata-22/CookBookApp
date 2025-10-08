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
  role: string;

  // Recipes created by user
  @OneToMany(() => Recipe, recipe => recipe.postedBy)
  recipes: Recipe[];

  // Favorite recipes
  @ManyToMany(() => Recipe, { cascade: true })
  @JoinTable()
  favoriteRecipes: Recipe[];
}
