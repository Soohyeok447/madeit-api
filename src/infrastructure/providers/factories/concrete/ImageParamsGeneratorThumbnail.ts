import { MulterFile } from "src/domain/types";
import { getS3BucketName } from "src/infrastructure/environment";
import { ImageParams, ImageParamsGenerator } from "../ImageParamsGenerator";

export class ImageParamsGeneratorThumbnailImpl implements ImageParamsGenerator {
  constructor(
    private imageFile: MulterFile,
    private key: string,
  ){}

  getParams(): ImageParams {
    return {
      Bucket: getS3BucketName(),
      Key: `origin/${this.key}`,
      Body: this.imageFile.buffer,
      ContentType: 'image',
    };
  }
}