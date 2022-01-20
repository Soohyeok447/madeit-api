import { Resolution } from "../enums/resolution.enum";


export abstract class ImageProvider {
  //쿼리, 키, filename을 조합해서 cdn url로 이미지 요청을 보냄
  abstract requestImageToCloudfront(resolution: Resolution, key: string, filenames: string[]):  Promise<string | string[]>;


}