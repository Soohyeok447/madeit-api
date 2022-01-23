import { ImageType } from '../enums/image.enum';
import { ReferenceId } from '../enums/reference_id.enum';

export class Image {
  id: string;

  type: ImageType;

  referenceId: string;
  
  referenceModel: ReferenceId;

  key: string;
  
  filenames: string[];
}
