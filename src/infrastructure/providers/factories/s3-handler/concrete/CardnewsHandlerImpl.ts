import { MulterFile } from '../../../../../domain/common/types';
import { getS3BucketName } from '../../../../environment';
import { s3Params, S3Handler } from '../S3Handler';

export class CardnewsHandlerImpl implements S3Handler {
  public getParamsToPutS3Object(
    imageFile: MulterFile,
    title?: string,
  ): s3Params {
    const splittedImageName: string[] = imageFile['originalname'].split('.');
    splittedImageName.pop();
    const imageName: string = splittedImageName.join('');

    const params: {
      Bucket: 'madeit' | 'madeit-dev';
      Key: string;
      Body: Buffer;
      ContentType: string;
    } = {
      Bucket: getS3BucketName(),
      Key: `origin/recommended-routine/${title}/cardnews/${imageName}`,
      Body: imageFile.buffer,
      ContentType: 'image',
    };

    return params;
  }

  public async getCloudFrontUrlByS3Key(
    s3keys: string[],
  ): Promise<string | string[]> {
    //multiple image files
    const urls: string[] = await Promise.all(
      s3keys.map(async (e) => {
        const url: any = `${process.env.AWS_CLOUDFRONT_URL}/origin/${e}`;

        return url;
      }),
    );

    return urls;
  }
}
