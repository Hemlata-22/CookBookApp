import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

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
}
