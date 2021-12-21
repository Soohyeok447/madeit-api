import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


/**
 * 
 * @ApiTags()
 * @ApiOperation({options})
 * @ApiCreatedResponse({options})
 */

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Routine API Docs')
    .setDescription('dev - http://3.37.139.50/v1/')
    .setVersion('1.0.0')
    .addBearerAuth(
      { 
        description: `Bearer [value]`,
        name: 'Authorization',
        bearerFormat: 'Bearer', 
        scheme: 'Bearer',
        type: 'http',
        in: 'Header'
      },
      'accessToken | refreshToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}