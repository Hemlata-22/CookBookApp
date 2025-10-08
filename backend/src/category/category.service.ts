import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
    constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  // create a new category
  async create(name: string): Promise<Category> {
    const category = this.categoryRepo.create({ name });
    return this.categoryRepo.save(category);
  }

  // get all categories
  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  // get category by ID
  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
