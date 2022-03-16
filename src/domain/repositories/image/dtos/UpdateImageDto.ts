import { ImageType } from '../../../common/enums/ImageType';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';

export class UpdateImageDto {
  public type?: ImageType;

  public reference_id?: string;

  public reference_model?: ReferenceModel;

  public cloud_keys?: string[];
}
