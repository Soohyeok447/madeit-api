import { ImageType } from 'src/domain/enums/ImageType';
import { ReferenceModel } from 'src/domain/enums/ReferenceModel';

export class UpdateImageDto {
  public type?: ImageType;

  public reference_id?: string;

  public reference_model?: ReferenceModel;

  public key?: string;

  public filenames?: string[];
}
