import { ImageModel } from '../../models/ImageModel';
import { CreateImageDto } from './dtos/CreateImageDto';
import { UpdateImageDto } from './dtos/UpdateImageDto';

export abstract class ImageRepository {
  abstract create(data: CreateImageDto): Promise<ImageModel>;

  abstract update(id: string, data: UpdateImageDto): Promise<ImageModel>;

  abstract delete(id: string): Promise<void>;

  abstract findOneByUserId(userId: string): Promise<ImageModel>;
}
