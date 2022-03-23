import { MulterFile } from '../../../../../domain/common/types';
import { getS3BucketName } from '../../../../environment';
import { s3Params, S3Handler } from '../S3Handler';

export class ProductHandlerImpl implements S3Handler {
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

  async getCloudFrontUrlByS3Key(s3keys: string[]): Promise<string | string[]> {
    const url = `${process.env.AWS_CLOUDFRONT_URL}/origin/${s3keys[0]}`;

    return url;
  }
}
