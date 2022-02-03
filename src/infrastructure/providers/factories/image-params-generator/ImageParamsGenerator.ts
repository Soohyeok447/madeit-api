import { MulterFile } from "src/domain/types";

export abstract class ImageParamsGenerator {
  abstract getParams(): ImageParams;
}

export type ImageParams = {
  Bucket: string,
  Key: string,
  Body: Buffer,
  ContentType: string,
}