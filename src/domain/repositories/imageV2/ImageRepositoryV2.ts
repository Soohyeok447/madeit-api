import { ImageV2 } from '../../entities/ImageV2';

export abstract class ImageRepositoryV2 {
  public abstract save(dto: {
    buffer: Buffer;
    mimetype: string;
    description?: string;
  }): Promise<ImageV2>;

  public abstract delete(id: string): Promise<void>;

  public abstract findOne(id: string): Promise<ImageV2>;
}
