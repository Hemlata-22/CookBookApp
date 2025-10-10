import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // NestJS application ko create kar rahe hain using AppModule
  const app = await NestFactory.create(AppModule);
  // CORS enable kar rahe hain taaki frontend (Vite React app) backend ke sath communicate kar sake
  app.enableCors({
    origin: 'http://localhost:5173', // frontend ka URL
    credentials: true, // cookies / auth headers allow karne ke liye
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],  // allowed HTTP methods
  });

  // Server ko specified PORT pe start karna
  // Agar environment variable PORT defined nahi hai, to default 3000 use hoga
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
