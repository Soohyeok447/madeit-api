import { ImageType } from '../../domain/common/enums/ImageType';
import { ReferenceModel } from '../../domain/common/enums/ReferenceModel';
import { Resolution } from '../../domain/common/enums/Resolution';
import { ImageModel } from '../../domain/models/ImageModel';
import { ImageProvider } from '../../domain/providers/ImageProvider';
import { CreateImageDto } from '../../domain/repositories/image/dtos/CreateImageDto';
import { MulterFile } from '../../domain/common/types/MulterFile';
import { s3 } from '../config/s3';
import { getS3BucketName } from '../environment';
import { S3Handler } from './factories/s3-handler/S3Handler';
import { S3HandlerFactoryImpl } from './factories/s3-handler/concrete/S3HandlerFactoryImpl';
import { NotFoundImageException } from '../../infrastructure/providers/exceptions/NotFoundImageException';
import { S3 } from 'aws-sdk';

export class ImageProviderImpl implements ImageProvider {
  /**
   * mapper MongoObject to imageModel
   *
   * image_id를 레퍼런스로 가지는 MongoDB Collection에서
   * 해당 id로 populate를 하고 얻은 image객체를 imageModel로 매핑합니다
   * 이미지를 가지고 있는 Collection들을 find하고 mapping할 때 쓰입니다.
   */
  public mapDocumentToImageModel(
    populatedImageDocumentFromId: ImageModel,
  ): ImageModel {
    try {
      const imageModel: ImageModel = {
        id: populatedImageDocumentFromId['_id'],
        type: populatedImageDocumentFromId['type'],
        referenceId: populatedImageDocumentFromId['reference_id'],
        referenceModel: populatedImageDocumentFromId['reference_model'],
        key: populatedImageDocumentFromId['key'],
        filenames: populatedImageDocumentFromId['filenames'],
      };

      return imageModel;
    } catch (err) {
      throw new NotFoundImageException();
    }
  }

  /**
   * s3 bucket에 origin 이미지 저장
   */
  public putImageToS3(imageFile: MulterFile, key: string): S3.PutObjectOutput {
    const imageHandler: S3Handler = new S3HandlerFactoryImpl().createHandler(
      key,
    );

    const params = imageHandler.getParams(imageFile);

    let result;

    new Promise((resolve, reject) => {
      result = s3.putObject(params, (err, data) => {
        if (err) reject;

        resolve(data);
      });
    });

    return result;
  }

  /**
   * s3 bucket속 기존 origin, resize 이미지 삭제
   */
  public deleteImageFromS3(key: string, filename: string): void {
    const Bucket = getS3BucketName();

    const resolution: {
      key: string;
      value: string;
    }[] = Object.entries(Resolution).map(([key, value]) => ({ key, value }));

    const originParams = {
      Bucket,
      Key: `origin/${key}/${filename}`,
    };

    s3.deleteObject(originParams, (err, data) => {
      if (err) {
        throw err;
      }

      return data;
    });

    resolution.forEach((res) => {
      const resizeParams = {
        Bucket,
        Key: `resize/${key}/${filename}/${res.value}`,
      };

      s3.deleteObject(resizeParams, (err, data) => {
        if (err) {
          throw err;
        }

        return data;
      });
    });
  }

  /**
   * cloudfront로 s3 이미지를 불러와서 url로 변환
   */
  public async requestImageToCloudfront(
    imageModel: ImageModel,
  ): Promise<string | string[]> {
    const baseUrl: string = process.env.AWS_CLOUDFRONT_URL;

    const filenames: string[] = imageModel['filenames'];
    const key: string = imageModel['key'];
    const type: string = imageModel['type'];

    const imageHandler: S3Handler = new S3HandlerFactoryImpl().createHandler(
      key,
      type,
    );

    const url: string | string[] = await imageHandler.getUrl(
      baseUrl,
      key,
      filenames,
    );

    return url;
  }

  /**
   * S3에 이미지를 저장하면 S3Object객체를 받는데 그걸로 ImageCreateDto를 생성
   */
  public mapCreateImageDtoByS3Object(
    newImageS3Object,
    type: ImageType,
    referenceModel: ReferenceModel,
    referenceId?: string,
  ): CreateImageDto {
    let s3Keys: string[];
    let key: string;
    let filenames: string[];

    if (type == ImageType.cardnews) {
      s3Keys = newImageS3Object[0]['params']['Key'].split('/');
      key = `${s3Keys[1]}/${s3Keys[2]}`;
      filenames = newImageS3Object.map((e) => {
        return e['params']['Key'].split('/')[4];
      });
    } else if (type == ImageType.thumbnail) {
      s3Keys = newImageS3Object['params']['Key'].split('/');
      key = `${s3Keys[1]}/${s3Keys[2]}`;
      filenames = [`thumbnail`];
    } else {
      s3Keys = newImageS3Object['params']['Key'].split('/');
      key = s3Keys[1];
      filenames = [s3Keys[2]];
    }

    const newImageData: CreateImageDto = {
      type,
      reference_id: referenceId,
      reference_model: referenceModel,
      key,
      filenames,
    };

    return newImageData;
  }
}
