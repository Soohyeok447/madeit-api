import { S3Handler } from '../S3Handler';
import { S3HandlerFactory } from '../S3HandlerFactory';
import { RecommendedRoutineCardnewsHandler } from './RecommendedRoutineCardnewsHandler';
import { ProductHandler } from './ProductHandler';
import { AvatarHandler } from './AvatarHandler';
import { ThumbnailHandler } from './ThumbnailHandler';
import { InvalidImageKeyException } from '../exceptions/InvalidImageKeyException';
import { Injectable } from '@nestjs/common';
import { LoggerProvider } from '../../../../../domain/providers/LoggerProvider';
import { InformationBoardHandler } from './InformationBoardHandler';

@Injectable()
export class S3HandlerFactoryImpl implements S3HandlerFactory {
  public constructor(private readonly _logger: LoggerProvider) {}

  public createHandler(type: string): S3Handler {
    switch (type) {
      case 'recommendedRoutineThumbnail': {
        return new ThumbnailHandler();
      }

      case 'recommendedRoutineCardnews': {
        return new RecommendedRoutineCardnewsHandler();
      }

      case 'infoBoard': {
        return new InformationBoardHandler();
      }

      case 'product': {
        return new ProductHandler();
      }

      case 'avatar': {
        return new AvatarHandler();
      }

      default:
        throw new InvalidImageKeyException(type);
    }
  }
}
