import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { UserRepository } from '../domain/repositories/user/UserRepository';
import { ImageSchema } from '../infrastructure/schemas/ImageSchema';
import { AddPostUseCase } from '../domain/use-cases/information-board/add-post/AddPostUseCase';
import { AddPostUseCaseImpl } from '../domain/use-cases/information-board/add-post/AddPostUseCaseImpl';
import { InformationBoardSchema } from '../infrastructure/schemas/InformationBoardSchema';
import { InformationBoardRepository } from '../domain/repositories/information-board/InformationBoardRepository';
import { InformationBoardRepositoryImpl } from '../infrastructure/repositories/InformationBoardRepositoryImpl';
import { InformationBoardControllerInjectedDecorator } from './controllers/information-board/InformationBoardControllerInjectedSwagger';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Image',
        schema: ImageSchema,
      },
      {
        name: 'Information-Board',
        schema: InformationBoardSchema,
      },
    ]),
  ],
  controllers: [InformationBoardControllerInjectedDecorator],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: InformationBoardRepository,
      useClass: InformationBoardRepositoryImpl,
    },
    {
      provide: AddPostUseCase,
      useClass: AddPostUseCaseImpl,
    },
  ],
  exports: [],
})
export class InformationBoardModule {}
