import { S3Handler } from './S3Handler';

export abstract class S3HandlerFactory {
  public abstract createHandler(type: string, title?: string): S3Handler;
}
