import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

  // POST /category  -create a new category
  @Post()
  async create(@Body('name') name: string) {
    // Service ko call kar rahe hain category create karne ke liye
    return this.categoryService.create(name);
  }

  // GET /category  -get all category
  @Get()
  async findAll() {
    // Service se saari categories fetch karte hain
    return this.categoryService.findAll();
  }

  // GET /category/:id  -get category by id
  @Get(':id')
  async findById(@Param('id') id: number) {
    // Service se specific category fetch karna
    return this.categoryService.findById(Number(id));
  }
}
