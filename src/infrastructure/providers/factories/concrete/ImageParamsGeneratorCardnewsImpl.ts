import { MulterFile } from "src/domain/types";
import { getS3BucketName } from "src/infrastructure/environment";
import { ImageParams, ImageParamsGenerator } from "../ImageParamsGenerator";

export class ImageParamsGeneratorCardnewsImpl implements ImageParamsGenerator {
  constructor(
    private imageFile: MulterFile,
    private key: string,
  ){}

  getParams(): ImageParams {
    const splittedImageName = this.imageFile["originalname"].split('.')
    splittedImageName.pop();
    const imageName = splittedImageName.join('')

    const params = {
      Bucket: getS3BucketName(),
      Key: `origin/${this.key}/${imageName}`,
      Body: this.imageFile.buffer,
      ContentType: 'image',
    };

    return params;
  }
}