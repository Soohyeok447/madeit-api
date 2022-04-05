import { Module } from '@nestjs/common';
import { AddPostUseCase } from '../domain/use-cases/information-board/add-post/AddPostUseCase';
import { AddPostUseCaseImpl } from '../domain/use-cases/information-board/add-post/AddPostUseCaseImpl';
import { InformationBoardControllerInjectedDecorator } from './controllers/information-board/InformationBoardControllerInjectedSwagger';

@Module({
  imports: [],
  controllers: [InformationBoardControllerInjectedDecorator],
  providers: [
    {
      provide: AddPostUseCase,
      useClass: AddPostUseCaseImpl,
    },
  ],
  exports: [],
})
export class InformationBoardModule {}
