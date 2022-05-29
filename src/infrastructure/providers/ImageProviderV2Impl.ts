import { Injectable } from '@nestjs/common';
import { ImageProviderV2 } from '../../domain/providers/ImageProviderV2';
import { ImageV2 } from '../../domain/entities/ImageV2';

@Injectable()
export class ImageProviderV2Impl implements ImageProviderV2 {
  public getDefaultAvatarUrl(): string {
    return `${process.env.AWS_CLOUDFRONT_URL}/2fc8d005-6dd4-469c-a2b0-2ea9e2456c20`;
  }

  public getImageUrl(image: ImageV2): string {
    return `${process.env.AWS_CLOUDFRONT_URL}/${image.uuid}`;
  }
}
