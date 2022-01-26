import { ImageType } from 'src/domain/enums/ImageType';
import { ReferenceId } from 'src/domain/enums/ReferenceId';

export class CreateImageDto {
  public type: ImageType;

  public reference_id?: string;

  public reference_model: ReferenceId;

  public key: string;

  public filenames: string[];
}
