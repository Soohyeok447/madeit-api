import { S3Handler } from '../S3Handler';
import { S3HandlerFactory } from '../S3HandlerFactory';
import { CardnewsHandlerImpl } from './CardnewsHandlerImpl';
import { ProductHandlerImpl } from './ProductHandlerImpl';
import { AvatarHandlerImpl } from './AvatarHandlerImpl';
import { ThumbnailHandlerImpl } from './ThumbnailHandlerImpl';
import { InvalidImageKeyException } from '../exceptions/InvalidImageKeyException';
import { Injectable } from '@nestjs/common';
import { LoggerProvider } from '../../../../../domain/providers/LoggerProvider';

@Injectable()
export class S3HandlerFactoryImpl implements S3HandlerFactory {
  public constructor(private readonly _logger: LoggerProvider) {}

  public createHandler(type: string): S3Handler {
    switch (type) {
      case 'thumbnail': {
        return new ThumbnailHandlerImpl();
      }

      case 'cardnews': {
        return new CardnewsHandlerImpl();
      }

      case 'product': {
        return new ProductHandlerImpl();
      }

      case 'avatar': {
        return new AvatarHandlerImpl();
      }

      default:
        this._logger.error(`유효하지 않은 Image type Enum. type - ${type} `);
        throw new InvalidImageKeyException();
    }
  }
}
