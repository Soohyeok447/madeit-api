import { Module } from '@nestjs/common';
import { AddPostUseCase } from '../domain/use-cases/information-board/add-post/AddPostUseCase';
import { AddPostUseCaseImpl } from '../domain/use-cases/information-board/add-post/AddPostUseCaseImpl';
import { DeletePostUseCase } from '../domain/use-cases/information-board/delete-post/DeletePostUseCase';
import { DeletePostUseCaseImpl } from '../domain/use-cases/information-board/delete-post/DeletePostUseCaseImpl';
import { GetPostUseCase } from '../domain/use-cases/information-board/get-post/GetPostUseCase';
import { GetPostUseCaseImpl } from '../domain/use-cases/information-board/get-post/GetPostUseCaseImpl';
import { GetPostsUseCase } from '../domain/use-cases/information-board/get-posts/GetPostsUseCase';
import { GetPostsUseCaseImpl } from '../domain/use-cases/information-board/get-posts/GetPostsUseCaseImpl';
import { ModifyPostUseCase } from '../domain/use-cases/information-board/modify-post/ModifyPostUseCase';
import { ModifyPostUseCaseImpl } from '../domain/use-cases/information-board/modify-post/ModifyPostUseCaseImpl';
import { PutCardnewsUseCase } from '../domain/use-cases/information-board/put-cardnews/PutCardnewsUseCase';
import { PutCardnewsUseCaseImpl } from '../domain/use-cases/information-board/put-cardnews/PutCardnewsUseCaseImpl';
import { InformationBoardControllerInjectedDecorator } from './controllers/information-board/InformationBoardControllerInjectedSwagger';

@Module({
  imports: [],
  controllers: [InformationBoardControllerInjectedDecorator],
  providers: [
    {
      provide: AddPostUseCase,
      useClass: AddPostUseCaseImpl,
    },
    {
      provide: ModifyPostUseCase,
      useClass: ModifyPostUseCaseImpl,
    },
    {
      provide: DeletePostUseCase,
      useClass: DeletePostUseCaseImpl,
    },
    {
      provide: GetPostUseCase,
      useClass: GetPostUseCaseImpl,
    },
    {
      provide: GetPostsUseCase,
      useClass: GetPostsUseCaseImpl,
    },
    {
      provide: PutCardnewsUseCase,
      useClass: PutCardnewsUseCaseImpl,
    },
  ],
  exports: [],
})
export class InformationBoardModule {}
