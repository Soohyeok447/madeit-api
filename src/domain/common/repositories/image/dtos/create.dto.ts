import { ImageType } from "src/domain/common/enums/image.enum";
import { SubImage } from "../../../models/image.model";

export class CreateImageDto {
  public type: ImageType;

  public image: SubImage[];
}
