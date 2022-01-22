import * as moment from "moment";
import { ImageType } from "src/domain/common/enums/image.enum";
import { ReferenceId } from "src/domain/common/enums/reference_id.enum";
import { Resolution } from "src/domain/common/enums/resolution.enum";
import { Image } from "src/domain/common/models/image.model";
import { S3Object } from "src/domain/common/models/s3object.model";
import { ImageProvider } from "src/domain/common/providers/image.provider";
import { CreateImageDto } from "src/domain/common/repositories/image/dtos/create.dto";
import { MulterFile } from "src/domain/types";
import { s3 } from "../config/s3";
import { getS3BucketName } from "../environment";
import { HttpClientImpl } from "../utils/providers/http_client";


export class ImageProviderImpl implements ImageProvider {

  /** 
   * imageModel mapper
   * 
   * image_id를 레퍼런스로 가지는 모델에서
   * id로 image model을 find하고 mapping
  */
  public mapDocumentToImageModel(imageDocument: { [key: string]: any }) 
  : Image{
    const imageModel: Image = {
      id: imageDocument["_id"],
      type: imageDocument["type"],
      referenceId: imageDocument["reference_id"],
      referenceModel: imageDocument["reference_model"],
      key: imageDocument["key"],
      filenames: imageDocument["filenames"],
    }

    return imageModel;
  }

  /**
   * s3 bucket에 origin 이미지 저장
   */
  public putImageToS3(imageFile: MulterFile, key: string) {
    const Params = {
      Bucket: getS3BucketName(),
      Key: `origin/${key}/${moment().format('YYYYMMDD-HH:mm:ss')}-${imageFile.originalname}`,
      Body: imageFile.buffer,
      ContentType: "image",
    };

    let result;

    new Promise((resolve, reject) => {
      result = s3.putObject(Params, (err, data) => {
        if (err)
          reject;

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
    }[] = Object.entries(Resolution)
      .map(([key, value]) => ({ key, value }));

    const originParams = {
      Bucket,
      Key: `origin/${key}/${filename}`
    }

    s3.deleteObject(originParams, (err, data) => {
      if (err) { throw err; }

      return data;
    })

    resolution.forEach(res => {
      let resizeParams = {
        Bucket,
        Key: `resize/${res.value}/${key}/${filename}`
      }

      s3.deleteObject(resizeParams, (err, data) => {
        if (err) { throw err; }

        return data;
      })
    });
  }



  /**
   * cloudfront로 s3 이미지를 불러와서 버퍼(hex)로 변환
   */
  public async requestImageToCloudfront(
    resolution: Resolution,
    imageModel: Image
  ): Promise<string | string[]> {
    const baseUrl = process.env.AWS_CLOUDFRONT_URL;

    const filenames = imageModel["filenames"];
    const key = imageModel["key"];

    //single image file
    if (filenames.length === 1) {
      const url = `${baseUrl}/${resolution}/${key}/${filenames[0]}`;

      let result;

      try {
        result = await new HttpClientImpl().get(url);

      } catch (err) {
        throw new Error('image 로딩 에러');
      }
      const thumbnail = Buffer.from(result.data, 'base64').toString('hex');
      // const image = Buffer.from(result.data, 'base64').toString('utf8');

      return thumbnail;
    }

    //multiple image files
    const cardnews = await Promise.all(filenames.map(async e => {
      const url = `${baseUrl}/${resolution}/${key}/${e}`;

      let result;

      try {
        result = await new HttpClientImpl().get(encodeURI(url));

      } catch (err) {
        throw new Error('cardnews 로딩 에러');
      }
      const eachCardnews = Buffer.from(result.data, 'base64').toString('hex');

      return eachCardnews;
    }))

    return cardnews;
  }

  public mapCreateImageDtoByS3Object(newImageS3Object, type: ImageType, referenceModel: ReferenceId, referenceId?: string, ): CreateImageDto {
    let s3Keys: string[];
    let key: string;
    let filenames: string[];

    if (type == ImageType.cardnews) {
      s3Keys = newImageS3Object[0]['params']['Key'].split('/');
      key = `${s3Keys[1]}/${s3Keys[2]}`;
      filenames = newImageS3Object.map(e => {
        return e['params']['Key'].split('/')[3];
      });

    }else{
      s3Keys = newImageS3Object['params']['Key'].split('/');
      key = s3Keys[1];
      filenames = [s3Keys[2]];
    }

    const newImageData: CreateImageDto = {
      type,
      reference_id: referenceId,
      reference_model: referenceModel,
      key,
      filenames
    };

    return newImageData;
  }

}