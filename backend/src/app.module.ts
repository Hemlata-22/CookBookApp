import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'cookbook_user',
      password: 'cookbook_pass',
      database: 'cookbook_db',
      autoLoadEntities: true,
      synchronize: true, // automatically creates tables from entities
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
