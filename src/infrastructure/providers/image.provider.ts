import { ImageType } from "src/domain/common/enums/image.enum";
import { Resolution } from "src/domain/common/enums/resolution.enum";
import { Image } from "src/domain/common/models/image.model";
import { S3Object } from "src/domain/common/models/s3object.model";
import { ImageProvider } from "src/domain/common/providers/image.provider";
import { File } from "src/domain/types";
import { s3 } from "../config/s3";
import { getS3BucketName } from "../environment";
import { HttpClientImpl } from "../utils/providers/http_client";


export class ImageProviderImpl implements ImageProvider {

  //imageModel mapper
  public mapDocumentToImageModel(imageDocument: { [key: string]: any }) {
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

  public putImageToS3(imageFile: File, key: string) {
    const Params = {
      Bucket: getS3BucketName(),
      Key: `origin/${key}/${imageFile.originalname}`,
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



  public async requestImageToCloudfront(
    resolution: Resolution,
    imageModel: Image
  ): Promise<string | string[]> {
    const baseUrl = `http://d28okinpr57gbg.cloudfront.net`;

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

  public async deleteImageFromS3(image: any): Promise<void> {

  }

}