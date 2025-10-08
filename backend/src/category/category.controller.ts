import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

  // POST /category
  @Post()
  async create(@Body('name') name: string) {
    return this.categoryService.create(name);
  }

  // GET /category
  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  // GET /category/:id
  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.categoryService.findById(Number(id));
  }
}
