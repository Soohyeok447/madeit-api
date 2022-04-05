import { MulterFile } from '../common/types/index';
import { ImageType } from '../common/enums/ImageType';
import { ReferenceModel } from '../common/enums/ReferenceModel';
import { ImageModel } from '../models/ImageModel';
import { CreateImageDto } from '../repositories/image/dtos/CreateImageDto';

export type CloudKey = string;

export abstract class ImageProvider {
  /**
   * CDN으로 이미지를 불러와서 url로 변환
   *
   * string, string[]으로 return 하는 이유는 cardnews와 같이 여러 이미지가 필요한 경우가 있음
   *  */
  public abstract requestImageToCDN(
    imageModel: ImageModel,
  ): Promise<string | string[]>;

  /**
   * db에서 얻은 이미지객체를 매개변수로써 ImageModel로 매핑한후 반환
   */
  public abstract getMappedImageModel(imageDocument: ImageModel): ImageModel;

  /**
   * cloud에 origin 이미지 저장한 후 데이터가 저장된 url key를 반환합니다
   */
  public abstract putImageFileToCloudDb(
    imageFile: MulterFile,
    imageType: ImageType,
    title?: string,
  ): CloudKey;

  /**
   * cloud속 기존 origin, resize 이미지 삭제
   */
  public abstract deleteImageFileFromCloudDb(cloudKey: string): void;

  /**
   * imageRepository에 이미지객체를 저장하기 위한 createImageDto생성
   */
  public abstract mapCreateImageDtoByCloudKey(
    cloudKeys: string[],
    type: ImageType,
    referenceModel: ReferenceModel,
    referenceId?: string,
  ): CreateImageDto;
}
