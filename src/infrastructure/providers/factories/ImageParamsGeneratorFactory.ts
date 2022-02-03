import { MulterFile } from "src/domain/types";
import { ImageParamsGenerator } from "./ImageParamsGenerator";

export abstract class ImageParamsGeneratorFactory {
  abstract makeGenerator(imageFile: MulterFile, key: string): ImageParamsGenerator;
}

