import { ImageType } from '../../../../domain/enums/ImageType';
import { ReferenceModel } from '../../../../domain/enums/ReferenceModel';

export class CreateImageDto {
  public type: ImageType;

  public reference_id?: string;

  public reference_model: ReferenceModel;

  public key: string; //s3 key

  public filenames: string[];
}
