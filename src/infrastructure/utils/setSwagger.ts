import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

/**
 *
 * @ApiTags()
 * @ApiOperation({options})
 * @ApiCreatedResponse({options})
 */

export function setSwagger(app: INestApplication): void {
  const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('madeit API Docs')
    .setDescription(
      '개발 - dev.api.madeit.develife.kr/v1/  <br /> 프로덕션 - api.madeit.develife.kr/v1/ <br /> www.develife.kr',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        description: `Bearer [value]`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'JWT',
    )
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}
