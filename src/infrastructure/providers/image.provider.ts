import { Resolution } from "src/domain/common/enums/resolution.enum";
import { ImageProvider } from "src/domain/common/providers/image.provider";
import { HttpClientImpl } from "../utils/providers/http_client";


export class ImageProviderImpl implements ImageProvider {
  public async requestImageToCloudfront(resolution: Resolution, key: string, filenames: string[]): Promise<string | string[]> {
    const baseUrl = `http://d28okinpr57gbg.cloudfront.net`;

    if (filenames.length === 1) {
      const url = `${baseUrl}/${resolution}/${key}/${filenames[0]}`;

      try{
        const result = await new HttpClientImpl().get(encodeURI(url));
  
        const thumbnail = Buffer.from(result.data, 'base64').toString('hex');
        // const image = Buffer.from(result.data, 'base64').toString('utf8');
  
        return thumbnail;
      }catch(err){
        console.log(err);

        throw new Error('thumbnail 로딩 에러');
      }
    }
    
    const cardnews = await Promise.all(filenames.map(async e => {
      const url = `${baseUrl}/${resolution}/${key}/${e}`;
      
      try{
        const result = await new HttpClientImpl().get(encodeURI(url));
        
        const eachCardnews = Buffer.from(result.data, 'base64').toString('hex');
        
        return eachCardnews;
      }catch(err){
        console.log(err);
        
        throw new Error('cardnews 로딩 에러');
      }
    }))

    return cardnews;
  }

  public async deleteImageFromS3(image: any): Promise<void> {

  }

}