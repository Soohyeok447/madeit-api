import { Injectable } from '@nestjs/common';
import { AddImageByUserUseCase } from '../../domain/use-cases/image/add-image-by-user/AddImageByUserUseCase';
import { AddImageByUserResponseDto } from '../../domain/use-cases/image/add-image-by-user/dtos/AddImageByUserResponseDto';

@Injectable()
export class ImageController {
  public constructor(
    private readonly addImageByUserUseCase: AddImageByUserUseCase,
  ) {}

  public async addImageByUser(
    image: Express.Multer.File,
    body?: object,
  ): Promise<AddImageByUserResponseDto> {
    return this.addImageByUserUseCase.execute({
      image,
      description: body['description'],
    });
  }
}
