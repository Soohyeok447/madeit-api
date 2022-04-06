import { ObjectId } from '../../common/types';
import { ImageModel } from '../../models/ImageModel';
import { CreateImageDto } from './dtos/CreateImageDto';
import { UpdateImageDto } from './dtos/UpdateImageDto';

export abstract class ImageRepository {
  public abstract create(data: CreateImageDto): Promise<ImageModel>;

  public abstract update(id: string, data: UpdateImageDto): Promise<ImageModel>;

  public abstract delete(id: string): Promise<void>;

  public abstract findOne(id: string | ObjectId): Promise<ImageModel>;

  public abstract findOneByUserId(userId: string): Promise<ImageModel>;
}
