import { HttpException } from "@nestjs/common";
import { MulterFile } from "src/domain/types";
import { ImageParamsGenerator } from "../ImageParamsGenerator";
import { ImageParamsGeneratorFactory } from "../ImageParamsGeneratorFactory";
import { ImageParamsGeneratorCardnewsImpl } from "./ImageParamsGeneratorCardnewsImpl";
import { ImageParamsGeneratorProductImpl } from "./ImageParamsGeneratorProductImpl";
import { ImageParamsGeneratorProfileImpl } from "./ImageParamsGeneratorProfileImpl";
import { ImageParamsGeneratorThumbnailImpl } from "./ImageParamsGeneratorThumbnail";

export class ImageParamsGeneratorFactoryImpl implements ImageParamsGeneratorFactory {
  constructor() { }

   makeGenerator(imageFile: MulterFile, key: string): ImageParamsGenerator {
    let mainKey: string;
    
    mainKey = key.split('/')[2];
    
    if(!mainKey) {
      mainKey = key;
    }

    switch (mainKey) {
      case 'thumbnail': {
        return new ImageParamsGeneratorThumbnailImpl(imageFile, key);
      }

      case 'cardnews': {
        return new ImageParamsGeneratorCardnewsImpl(imageFile, key);

      }

      case 'product': {
        return new ImageParamsGeneratorProductImpl(imageFile, key);

      }

      case 'profile': {
        return new ImageParamsGeneratorProfileImpl(imageFile, key);

      }

      default: throw new HttpException('잘못된 이미지 키값', 500);
    }
  }

}