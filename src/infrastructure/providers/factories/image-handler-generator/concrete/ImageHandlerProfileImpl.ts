import { getS3BucketName } from "src/infrastructure/environment";
import { ImageParams, ImageHandler } from "../ImageHandler";
import { v4 } from "uuid";
import { MulterFile } from "src/domain/types";

export class ImageHandlerProfileImpl implements ImageHandler {
  constructor(
    private key: string,
  ) { }

  getParams(imageFile: MulterFile): ImageParams {
    return {
      Bucket: getS3BucketName(),
      Key: `origin/${this.key}/${v4()}`,
      Body: imageFile.buffer,
      ContentType: 'image',
    };
  }

  async getUrl(baseUrl: string, key: string, filenames: string[]): Promise<string | string[]> {
    const url = `${baseUrl}/${key}/${filenames[0]}`;

    return url;
  }
}