import { Module } from '@nestjs/common';
import { GetPostUseCase } from '../domain/use-cases/information-board/get-post/GetPostUseCase';
import { GetPostUseCaseImpl } from '../domain/use-cases/information-board/get-post/GetPostUseCaseImpl';
import { GetPostsUseCase } from '../domain/use-cases/information-board/get-posts/GetPostsUseCase';
import { GetPostsUseCaseImpl } from '../domain/use-cases/information-board/get-posts/GetPostsUseCaseImpl';
import { InformationBoardControllerInjectedDecorator } from './controllers/information-board/InformationBoardControllerInjectedSwagger';

@Module({
  imports: [],
  controllers: [InformationBoardControllerInjectedDecorator],
  providers: [
    {
      provide: GetPostUseCase,
      useClass: GetPostUseCaseImpl,
    },
    {
      provide: GetPostsUseCase,
      useClass: GetPostsUseCaseImpl,
    },
  ],
  exports: [],
})
export class InformationBoardModule {}
