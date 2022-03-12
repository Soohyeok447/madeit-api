import { MulterFile } from '../../../../../domain/common/types';
import { getS3BucketName } from '../../../../../infrastructure/environment';
import { ImageParams, ImageHandler } from '../ImageHandler';

export class ImageHandlerThumbnailImpl implements ImageHandler {
  constructor(private key: string) {}

  getParams(imageFile: MulterFile): ImageParams {
    return {
      Bucket: getS3BucketName(),
      Key: `origin/${this.key}`,
      Body: imageFile.buffer,
      ContentType: 'image',
    };
  }

  async getUrl(
    baseUrl: string,
    key: string,
    filenames: string[],
  ): Promise<string | string[]> {
    const url = `${baseUrl}/${key}/${filenames[0]}`;

    return url;
  }
}
