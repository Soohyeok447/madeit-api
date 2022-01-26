import { ImageType } from '../enums/ImageType';
import { ReferenceId } from '../enums/ReferenceId';

export class ImageModel {
  id: string;

  type: ImageType;

  referenceId: string;

  referenceModel: ReferenceId;

  key: string;

  filenames: string[];
}
