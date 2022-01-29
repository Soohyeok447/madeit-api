import { ImageType } from '../enums/ImageType';
import { ReferenceModel } from '../enums/ReferenceModel';

export class ImageModel {
  id: string;

  type: ImageType;

  referenceId: string;

  referenceModel: ReferenceModel;

  key: string;

  filenames: string[];
}
