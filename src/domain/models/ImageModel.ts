import { ImageType } from '../common/enums/ImageType';
import { ReferenceModel } from '../common/enums/ReferenceModel';

export class ImageModel {
  public readonly id: string;

  public readonly type: ImageType;

  public readonly referenceId: string;

  public readonly referenceModel: ReferenceModel;

  public readonly cloudKeys: string[];
}
