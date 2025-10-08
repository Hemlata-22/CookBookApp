import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [TypeOrmModule.forFeature([Recipe]),
   UserModule,
   HttpModule //it enables HttpService injection
   //This makes Nest provide HttpService to RecipeService so we can call external APIs.
  ],
  providers: [RecipeService],
  controllers: [RecipeController]
})
export class RecipeModule {}
