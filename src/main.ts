import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with specific configuration
  app.enableCors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('HSE PDF Report Generator')
    .setDescription('API for generating PDF reports with browser automation')
    .setVersion('1.0')
    .addServer('http://localhost:8000')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'HSE PDF Report Generator API',
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      defaultModelsExpandDepth: -1,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      deepLinking: true,
      displayOperationId: false,
      defaultModelExpandDepth: 1,
      defaultModelRendering: 'model',
      displayRequestDuration: true,
    },
  });

  await app.listen(8000);
  console.log(`Application is running on: http://localhost:8000`);
}
bootstrap(); 