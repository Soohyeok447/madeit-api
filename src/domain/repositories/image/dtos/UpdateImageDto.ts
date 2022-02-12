import { ImageType } from '../../../../domain/enums/ImageType';
import { ReferenceModel } from '../../../../domain/enums/ReferenceModel';

export class UpdateImageDto {
  public type?: ImageType;

  public reference_id?: string;

  public reference_model?: ReferenceModel;

  public key?: string;

  public filenames?: string[];
}
