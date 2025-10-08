import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  instructions: string;

  @Column({ nullable: true })
  thumbnail: string;

  @CreateDateColumn()
  postedAt: Date;

  @ManyToOne(() => User, user => user.id)
  postedBy: User;

  @Column('simple-array', { nullable: true })
  ingredients: string[]; // stored as comma-separated values(csv)

  // category relation 
  @ManyToOne(() => Category, category => category.recipes, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;
}
