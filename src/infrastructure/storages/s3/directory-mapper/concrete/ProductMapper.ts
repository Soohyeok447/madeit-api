import { MulterFile } from '../../../../../domain/common/types';
import { getS3BucketName } from '../../../../environment';
import { s3Params, DirectoryMapper } from '../DirectoryMapper';

export class ProductMapper implements DirectoryMapper {
  getParamsToPutS3Object(imageFile: MulterFile, title?: string): s3Params {
    const splittedImageName = imageFile['originalname'].split('.');
    splittedImageName.pop();
    // const imageName = splittedImageName.join('');

    const params = {
      Bucket: getS3BucketName(),
      Key: `origin/product/${title}/thumbnail`,
      Body: imageFile.buffer,
      ContentType: 'image',
    };

    return params;
  }

  async getCloudFrontUrlByS3Key(s3key: string): Promise<string> {
    const url = `${process.env.AWS_CLOUDFRONT_URL}/origin/${s3key}`;

    return url;
  }
}
