import { S3Handler } from './S3Handler';

export abstract class S3HandlerFactory {
  abstract createHandler(key: string, type?: string): S3Handler;
}
