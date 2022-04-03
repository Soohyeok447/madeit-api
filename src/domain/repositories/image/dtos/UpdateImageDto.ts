import { ImageType } from '../../../common/enums/ImageType';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';

export class UpdateImageDto {
  public readonly type?: ImageType;

  public readonly reference_id?: string;

  public readonly reference_model?: ReferenceModel;

  public readonly cloud_keys?: string[];
}
