import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;//unique id for each user

  @Column()
  name: string;

  @Column('text')
  instructions: string;

  @Column({ nullable: true })
  thumbnail: string; //optional imagE url

  @CreateDateColumn()
  postedAt: Date;//Automatically set jb recipe create hoti hai

  @ManyToOne(() => User, user => user.id)
  postedBy: User;//recipe kis user ne post ki hai

  @Column('simple-array', { nullable: true })
  ingredients: string[]; // stored ingredients as comma-separated values(csv)

  // category relation 
  @ManyToOne(() => Category, category => category.recipes, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: number; //Foreign key
}
