import { Injectable } from '@nestjs/common';
import { AddBannerUseCase } from '../../domain/use-cases/admin/add-banner/AddBannerUseCase';
import { AddImageByUserResponseDto } from '../../domain/use-cases/image/add-image-by-user/dtos/AddImageByUserResponseDto';

@Injectable()
export class BannerController {
  public constructor(private readonly addBannerUseCase: AddBannerUseCase) {}

  // public async addImageByUser(
  //   image: Express.Multer.File,
  //   body?: object,
  // ): Promise<AddImageByUserResponseDto> {
  //   return this.addBannerUseCase.execute({
  //     image,
  //     description: body['description'],
  //   });
  // }
}
