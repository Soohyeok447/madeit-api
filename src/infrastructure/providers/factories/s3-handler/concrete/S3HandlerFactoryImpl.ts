import { HttpException } from '@nestjs/common';
import { S3Handler } from '../S3Handler';
import { S3HandlerFactory } from '../S3HandlerFactory';
import { CardnewsHandlerImpl } from './CardnewsHandlerImpl';
import { ProductHandlerImpl } from './ProductHandlerImpl';
import { AvatarHandlerImpl } from './AvatarHandlerImpl';
import { ThumbnailHandlerImpl } from './ThumbnailHandlerImpl';

export class S3HandlerFactoryImpl implements S3HandlerFactory {
  createHandler(key: string, type?: string): S3Handler {
    let mainKey: string;

    if (type) {
      mainKey = type;
    } else {
      if (key == 'profile') {
        mainKey = key;
      }
      if (key.split('/')[0] == 'routine') {
        mainKey = key.split('/')[2];
      }
    }

    switch (mainKey) {
      case 'thumbnail': {
        return new ThumbnailHandlerImpl(key);
      }

      case 'cardnews': {
        return new CardnewsHandlerImpl(key);
      }

      case 'product': {
        return new ProductHandlerImpl(key);
      }

      case 'profile': {
        return new AvatarHandlerImpl(key);
      }

      default:
    }

    throw new HttpException('잘못된 이미지 키값', 500);
  }
}
