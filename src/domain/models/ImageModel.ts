import { ImageType } from '../common/enums/ImageType';
import { ReferenceModel } from '../common/enums/ReferenceModel';
import { ObjectId } from '../common/types';

export class ImageModel {
  public readonly id: ObjectId;

  public readonly type: ImageType;

  public readonly referenceId: ObjectId;

  public readonly referenceModel: ReferenceModel;

  public readonly cloudKeys: string[];
}
