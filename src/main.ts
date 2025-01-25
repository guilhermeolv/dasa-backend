import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger';

async function bootstrap() {
  process.env.TZ = 'America/Sao_Paulo';

  const app = await NestFactory.create(AppModule);
  
  app.enableCors();

  setupSwagger(app);
  
  await app.listen(3000);
}
bootstrap(); 