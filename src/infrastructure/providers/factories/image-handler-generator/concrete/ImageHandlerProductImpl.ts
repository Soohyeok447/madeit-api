import { MulterFile } from "src/domain/types";
import { getS3BucketName } from "src/infrastructure/environment";
import { ImageParams, ImageHandler } from "../ImageHandler";

export class ImageHandlerProductImpl implements ImageHandler {
  constructor(
    private key: string,
  ) { }

  getParams(imageFile: MulterFile): ImageParams {
    const splittedImageName = imageFile["originalname"].split('.')
    splittedImageName.pop();
    const imageName = splittedImageName.join('')

    const params = {
      Bucket: getS3BucketName(),
      Key: `origin/${this.key}/${imageName}`,
      Body: imageFile.buffer,
      ContentType: 'image',
    };

    return params;
  }

  async getUrl(baseUrl: string, key: string, filenames: string[]): Promise<string | string[]> {
    const url = `${baseUrl}/${key}/${filenames[0]}/thumbnail`;

    return url;
  }
}