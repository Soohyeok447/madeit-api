import { HttpException } from '@nestjs/common';
import { ImageHandler } from '../ImageHandler';
import { ImageHandlerGeneratorFactory } from '../ImageHandlerGeneratorFactory';
import { ImageHandlerCardnewsImpl } from './ImageHandlerCardnewsImpl';
import { ImageHandlerProductImpl } from './ImageHandlerProductImpl';
import { ImageHandlerProfileImpl } from './ImageHandlerProfileImpl';
import { ImageHandlerThumbnailImpl } from './ImageHandlerThumbnailImpl';

export class ImageHandlerGeneratorFactoryImpl
  implements ImageHandlerGeneratorFactory
{
  constructor() {}

  makeHandler(key: string, type?: string): ImageHandler {
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
        return new ImageHandlerThumbnailImpl(key);
      }

      case 'cardnews': {
        return new ImageHandlerCardnewsImpl(key);
      }

      case 'product': {
        return new ImageHandlerProductImpl(key);
      }

      case 'profile': {
        return new ImageHandlerProfileImpl(key);
      }

      default:
    }

    throw new HttpException('잘못된 이미지 키값', 500);
  }
}
