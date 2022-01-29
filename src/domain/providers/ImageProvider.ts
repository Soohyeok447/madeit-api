import { MulterFile } from 'src/domain/types/index';
import { ImageType } from '../enums/ImageType';
import { ReferenceModel } from '../enums/ReferenceModel';
import { Resolution } from '../enums/Resolution';
import { ImageModel } from '../models/ImageModel';
import { CreateImageDto } from '../repositories/image/dtos/CreateImageDto';

export abstract class ImageProvider {
  //쿼리, 키, filename을 조합해서 cdn url로 이미지 요청을 A보냄
  abstract requestImageToCloudfront(
    resolution: Resolution,
    imageModel: ImageModel,
  ): Promise<string | string[]>;

  abstract mapDocumentToImageModel(imageDocument: {
    [key: string]: any;
  }): ImageModel;

  abstract putImageToS3(thumbnail: MulterFile, key: string);

  abstract deleteImageFromS3(key: string, filename: string): void;

  abstract mapCreateImageDtoByS3Object(
    newImageS3Object,
    type: ImageType,
    referenceModel: ReferenceModel,
    referenceId?: string,
  ): CreateImageDto;
}
