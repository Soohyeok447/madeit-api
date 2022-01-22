import { MulterFile } from "src/domain/types";
import { ImageType } from "../enums/image.enum";
import { ReferenceId } from "../enums/reference_id.enum";
import { Resolution } from "../enums/resolution.enum";
import { Image } from "../models/image.model";
import { CreateImageDto } from "../repositories/image/dtos/create.dto";


export abstract class ImageProvider {
  //쿼리, 키, filename을 조합해서 cdn url로 이미지 요청을 A보냄
  abstract requestImageToCloudfront(resolution: Resolution, imageModel: Image): Promise<string | string[]>;

  abstract mapDocumentToImageModel(imageDocument: { [key: string]: any }): Image;

  abstract putImageToS3(thumbnail: MulterFile, key: string);
  
  abstract deleteImageFromS3(key: string, filename: string): void
  
  abstract mapCreateImageDtoByS3Object(newImageS3Object, type: ImageType, referenceModel: ReferenceId, referenceId?: string): CreateImageDto
}