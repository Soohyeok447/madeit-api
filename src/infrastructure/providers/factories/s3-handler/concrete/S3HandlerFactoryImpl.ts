import { S3Handler } from '../S3Handler';
import { S3HandlerFactory } from '../S3HandlerFactory';
import { CardnewsHandlerImpl } from './CardnewsHandlerImpl';
import { ProductHandlerImpl } from './ProductHandlerImpl';
import { AvatarHandlerImpl } from './AvatarHandlerImpl';
import { ThumbnailHandlerImpl } from './ThumbnailHandlerImpl';
import { InvalidImageKeyException } from '../exceptions/InvalidImageKeyException';

export class S3HandlerFactoryImpl implements S3HandlerFactory {
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
        throw new InvalidImageKeyException();
    }
  }
}
