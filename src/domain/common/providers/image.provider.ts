import { File } from "src/domain/types";
import { ImageType } from "../enums/image.enum";
import { Resolution } from "../enums/resolution.enum";
import { Image } from "../models/image.model";
import { S3Object } from "../models/s3object.model";


export abstract class ImageProvider {
  //쿼리, 키, filename을 조합해서 cdn url로 이미지 요청을 A보냄
  abstract requestImageToCloudfront(resolution: Resolution, imageModel: Image): Promise<string | string[]>;

  abstract mapDocumentToImageModel(imageDocument: { [key: string]: any });

  abstract putImageToS3(thumbnail: File, key: string);
}