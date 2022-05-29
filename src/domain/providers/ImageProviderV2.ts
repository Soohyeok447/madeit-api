import { ImageV2 } from '../entities/ImageV2';

export abstract class ImageProviderV2 {
  public abstract getImageUrl(image: ImageV2): string;

  public abstract getDefaultAvatarUrl(): string;
}
