import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { User } from '../entities/user.entity';

export function setEnvironment() {
  switch (process.env.NODE_ENV) {
    case 'prod':
      return ['.env.prod'];
    case 'dev':
      return ['.env.dev'];
    case 'test':
    default:
      return '.env.test';
  }
}

export function setIgnoreEnvFile() {
  return process.env.NODE_ENV === 'prod' ? true : false;
}

export function setTypeOrmModule() {
  return TypeOrmModule.forRootAsync({
    useFactory: () => ({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User],
      synchronize: process.env.NODE_ENV !== 'prod',
      keepConnectionAlive: true,
    }),
  });
}

export function setValidationSchema() {
  return Joi.object({
    NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.string().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    JWT_ISSUER: Joi.string().required(),
  });
}
