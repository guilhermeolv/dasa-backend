import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('API de Catálogo de Produtos')
        .setDescription('API para gerenciamento de produtos e categorias')
        .setVersion('1.0')
        .addTag('Users')
        .addTag('Products')
        .addTag('Categories')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
} 