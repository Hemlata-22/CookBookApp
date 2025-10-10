import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RecipeModule } from './recipe/recipe.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    // Database connection setup using TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',              // Database type
      host: 'localhost',             // DB host
      port: 5432,                    // DB port
      username: 'cookbook_user',     // DB username
      password: 'cookbook_pass',     // DB password
      database: 'cookbook_db',       // DB name
      autoLoadEntities: true,        // Automatically load all entity files
      synchronize: true,             // automatically creates tables from entities
    }),
    // Importing feature modules
    UserModule,    // User related functionality (CRUD)
    AuthModule,    // Authentication functionality (login/register)
    RecipeModule,  // Recipe related functionality
    CategoryModule,// Category related functionality
  ],
  controllers: [AppController], // Default controller 
  providers: [AppService],      // Default service 
})
export class AppModule {}    // Root module jo backend app ke liye saare modules ko combine karta hai
