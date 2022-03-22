import { DirectoryMapper } from '../DirectoryMapper';
import { DirectoryMapperFactory } from '../DirectoryMapperFactory';
import { RecommendedRoutineMapper } from './RecommendedRoutineMapper';
import { ProductMapper } from './ProductMapper';
import { AvatarMapper } from './AvatarMapper';
import { InvalidImageKeyException } from '../exceptions/InvalidImageKeyException';
import { ReferenceType } from '../../../../../domain/common/enums/ReferenceType';

export class DirectoryMapperFactoryImpl implements DirectoryMapperFactory {
  create(type: ReferenceType): DirectoryMapper {
    switch (type) {
      case ReferenceType.RecommendedRoutine: {
        return new RecommendedRoutineMapper();
      }

      case ReferenceType.Product: {
        return new ProductMapper();
      }

      case ReferenceType.User: {
        return new AvatarMapper();
      }

      default:
        throw new InvalidImageKeyException();
    }
  }
}
