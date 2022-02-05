import { ImageType } from 'src/domain/enums/ImageType';
import { ReferenceModel } from 'src/domain/enums/ReferenceModel';
import { Resolution } from 'src/domain/enums/Resolution';
import { ImageModel } from 'src/domain/models/ImageModel';
import { ImageProvider } from 'src/domain/providers/ImageProvider';
import { CreateImageDto } from 'src/domain/repositories/image/dtos/CreateImageDto';
import { MulterFile } from 'src/domain/types/MulterFile';
import { s3 } from '../config/s3';
import { getS3BucketName } from '../environment';
import { ImageHandler } from './factories/image-handler-generator/ImageHandler';
import { ImageHandlerGeneratorFactoryImpl } from './factories/image-handler-generator/concrete/ImageHandlerGeneratorFactoryImpl';
import { NotFoundImageException } from 'src/infrastructure/providers/exceptions/NotFoundImageException';

export class ImageProviderImpl implements ImageProvider {
  /**
   * imageModel mapper
   *
   * image_id를 레퍼런스로 가지는 모델에서
   * id로 image model을 find하고 mapping
   */
  public mapDocumentToImageModel(imageDocument: {
    [key: string]: any;
  }): ImageModel {
    try {
      const imageModel: ImageModel = {
        id: imageDocument['_id'],
        type: imageDocument['type'],
        referenceId: imageDocument['reference_id'],
        referenceModel: imageDocument['reference_model'],
        key: imageDocument['key'],
        filenames: imageDocument['filenames'],
      };

      return imageModel;

    } catch (err) {
      throw new NotFoundImageException();
    }
  }

  /**
   * s3 bucket에 origin 이미지 저장
   */
  public putImageToS3(imageFile: MulterFile, key: string) {
    const imageHandler: ImageHandler = new ImageHandlerGeneratorFactoryImpl().makeHandler(key);

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
        Key: `resize/${res.value}/${key}/${filename}`,
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
   * cloudfront로 s3 이미지를 불러와서 버퍼(hex)로 변환
   */
  public async requestImageToCloudfront(
    imageModel: ImageModel,
  ): Promise<string | string[]> {
    const baseUrl: string = process.env.AWS_CLOUDFRONT_URL;

    const filenames: string[] = imageModel['filenames'];
    const key: string = imageModel['key'];
    const type: string = imageModel['type'];

    //필요한거 ~ mainKey별로 달라지는 것만 구분지어야겠죠? 그건 바로 url일 것입니다. getUrl이 맞겠군요
    const imageHandler: ImageHandler = new ImageHandlerGeneratorFactoryImpl().makeHandler(null, type);

    const url: string | string[] = await imageHandler.getUrl(baseUrl, key, filenames);

    return url;
  }

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
