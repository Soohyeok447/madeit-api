import { ImageType } from '../common/enums/ImageType';
import { ReferenceModel } from '../common/enums/ReferenceModel';

export class ImageModel {
  id: string;

  type: ImageType;

  referenceId: string;

  referenceModel: ReferenceModel;

  key: string;

  filenames: string[];
}
