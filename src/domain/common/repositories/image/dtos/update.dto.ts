import { ImageType } from "src/domain/common/enums/image.enum";
import { SubImage } from "../../../models/image.model";

export class UpdateImageDto {
  public type: ImageType;

  public image: SubImage[];
}
