import * as Joi from 'joi';

export function getEnvFilePath(): any {
  switch (process.env.NODE_ENV) {
    case 'prod':
      return ['.env.prod'];
    case 'dev':
      return ['.env.dev'];
    default:
      return '.env.test';
  }
}

export function getEnvironment(): 'prod' | 'dev' | 'test' {
  switch (process.env.NODE_ENV) {
    case 'prod':
      return 'prod';
    case 'dev':
      return 'dev';
    default:
      return 'test';
  }
}

export function getCorsOptions(): any {
  return { origin: `${process.env.ADMIN_PAGE_DOMAIN}`, credentials: true };
}

export function getS3BucketName(): 'madeit' | 'madeit-dev' {
  switch (process.env.NODE_ENV) {
    case 'prod':
      return 'madeit';
    case 'dev':
      return 'madeit-dev';
    default:
      return 'madeit-dev';
  }
}

export function getValidationSchema(): Joi.ObjectSchema<any> {
  return Joi.object({
    NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.string().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_URL: Joi.string().required(),
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    JWT_ISSUER: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_REGION: Joi.string().required(),
    AWS_S3_BUCKET_NAME: Joi.string().required(),
    AWS_CLOUDFRONT_URL: Joi.string().required(),
    GOOGLE_API_KEY_NODE: Joi.string().required(),
    GOOGLE_API_KEY_FIREBASE: Joi.string().required(),
  });
}

export function getDatabaseUrl(): string {
  return process.env.DATABASE_URL;
}

export function getDatabaseName(): string {
  return process.env.DATABASE_NAME;
}
