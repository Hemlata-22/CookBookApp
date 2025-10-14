import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RecipeModule } from './recipe/recipe.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    // Load .env file
    ConfigModule.forRoot({ isGlobal: true }),

    // Database connection setup using TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',            
      host: process.env.DB_HOST || 'localhost',  
      port: Number(process.env.DB_PORT) || 5432, 
      username: process.env.DB_USERNAME,     
      password: process.env.DB_PASSWORD,    
      database: process.env.DB_NAME,    
      autoLoadEntities: true,        // Automatically load all entity files
      synchronize: true,             // automatically creates tables from entities
    }),
    // Importing feature modules
    UserModule,    
    AuthModule,    
    RecipeModule, 
    CategoryModule,
  ],
  controllers: [AppController], // Default controller 
  providers: [AppService],      // Default server 
})
export class AppModule {}    // Root module jo backend app ke liye saare modules ko combine karta hai
