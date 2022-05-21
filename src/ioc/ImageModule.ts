import { Module } from '@nestjs/common';
import { ImageControllerInjectedDecorator } from './controllers/image/ImageControllerInjectedDecorator';
import { AddImageByUserUseCase } from '../domain/use-cases/image/add-image-by-user/AddImageByUserUseCase';
import { AddImageByUserUseCaseImpl } from '../domain/use-cases/image/add-image-by-user/AddImageByUserUseCaseImpl';

@Module({
  imports: [],
  controllers: [ImageControllerInjectedDecorator],
  providers: [
    {
      provide: AddImageByUserUseCase,
      useClass: AddImageByUserUseCaseImpl,
    },
  ],
  exports: [],
})
export class ImageModule {}
