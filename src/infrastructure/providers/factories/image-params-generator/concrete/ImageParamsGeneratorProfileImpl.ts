import { getS3BucketName } from "src/infrastructure/environment";
import { ImageParams, ImageParamsGenerator } from "../ImageParamsGenerator";
import { v4 } from "uuid";
import { MulterFile } from "src/domain/types";

export class ImageParamsGeneratorProfileImpl implements ImageParamsGenerator {
  constructor(
    private imageFile: MulterFile,
    private key: string,
  ){}

  getParams(): ImageParams {
    return {
      Bucket: getS3BucketName(),
      Key: `origin/${this.key}/${v4()}`,
      Body: this.imageFile.buffer,
      ContentType: 'image',
    };
  }
}