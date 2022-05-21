import { Injectable } from '@nestjs/common';
import { LoggerProvider } from 'src/domain/providers/LoggerProvider';
import { AddImageByUserResponseDto } from './dtos/AddImageByUserResponseDto';
import { AddImageByUserUseCase } from './AddImageByUserUseCase';
import { ImageRepositoryV2 } from '../../../repositories/imageV2/ImageRepositoryV2';
import { ImageV2 } from '../../../entities/ImageV2';
import { AddImageByUserUseCaseParams } from './dtos/AddImageByUserUseCaseParams';

@Injectable()
export class AddImageByUserUseCaseImpl implements AddImageByUserUseCase {
  public constructor(
    private readonly loggerProvider: LoggerProvider,
    private readonly imageRepositoryV2: ImageRepositoryV2,
  ) {}

  public async execute({
    image,
    description,
  }: AddImageByUserUseCaseParams): Promise<AddImageByUserResponseDto> {
    this.loggerProvider.setContext('addImageByUser');

    const newImage: ImageV2 = await this.imageRepositoryV2.save({
      buffer: image.buffer,
      mimetype: image.mimetype,
      description,
    });

    return { id: newImage.id };
  }
}
