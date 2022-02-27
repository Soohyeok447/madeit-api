import { MulterFile } from '../../../../../domain/types';
import { getS3BucketName } from '../../../../../infrastructure/environment';
import { ImageParams, ImageHandler } from '../ImageHandler';

export class ImageHandlerCardnewsImpl implements ImageHandler {
  constructor(private key: string) {}

  getParams(imageFile: MulterFile): ImageParams {
    const splittedImageName = imageFile['originalname'].split('.');
    splittedImageName.pop();
    const imageName = splittedImageName.join('');

    const params = {
      Bucket: getS3BucketName(),
      Key: `origin/${this.key}/${imageName}`,
      Body: imageFile.buffer,
      ContentType: 'image',
    };

    return params;
  }

  async getUrl(
    baseUrl: string,
    key: string,
    filenames: string[],
  ): Promise<string | string[]> {
    //multiple image files
    const urls = await Promise.all(
      filenames.map(async (e) => {
        const url = `${baseUrl}/${key}/cardnews/${e}`;

        return url;
      }),
    );

    return urls;
  }
}
