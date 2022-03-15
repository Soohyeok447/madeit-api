import { MulterFile } from '../../../../../domain/common/types';
import { getS3BucketName } from '../../../../environment';
import { s3Params, S3Handler } from '../S3Handler';

export class ProductHandlerImpl implements S3Handler {
  constructor(private key: string) {}

  getParams(imageFile: MulterFile): s3Params {
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
    const url = `${baseUrl}/${key}/${filenames[0]}/thumbnail`;

    return url;
  }
}
