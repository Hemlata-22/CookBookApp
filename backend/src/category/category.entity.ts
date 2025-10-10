import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Recipe } from '../recipe/recipe.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  // One category can have many recipes
  @OneToMany(() => Recipe, (recipe) => recipe.category)
  recipes: Recipe[]; //relation with recipe entity
}
