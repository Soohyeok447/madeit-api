import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './UserModule';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { JwtStrategy } from '../adapter/common/strategies/JwtStrategy';
import { JwtRefreshStrategy } from '../adapter/common/strategies/JwtRefreshStrategy';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { ImageRepositoryImpl } from '../infrastructure/repositories/ImageRepositoryImpl';
import { ImageSchema } from '../infrastructure/schemas/ImageSchema';
import { UserRepository } from '../domain/repositories/user/UserRepository';
import { ImageRepository } from '../domain/repositories/image/ImageRepository';
import { HttpClientImpl } from '../infrastructure/providers/HttpClientImpl';
import { HttpClient } from '../domain/providers/HttpClient';
import { HashProvider } from '../domain/providers/HashProvider';
import { HashProviderImpl } from '../infrastructure/providers/HashProviderImpl';
import { GoogleAuthProvider } from '../domain/providers/GoogleAuthProvider';
import { GoogleAuthProviderImpl } from '../infrastructure/providers/GoogleAuthProviderImpl';
import { AuthControllerInjectedDecorator } from './controllers/auth/AuthControllerInjectedDecorator';
import { SignInUseCaseImpl } from '../domain/use-cases/auth/sign-in/SignInUseCaseImpl';
import { ReissueAccessTokenUseCase } from '../domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCase';
import { ReissueAccessTokenUseCaseImpl } from '../domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCaseImpl';
import { SignOutUseCase } from '../domain/use-cases/auth/sign-out/SignOutUseCase';
import { SignOutUseCaseImpl } from '../domain/use-cases/auth/sign-out/SignOutUseCaseImpl';
import { AuthCommonService } from '../domain/use-cases/auth/service/AuthCommonService';
import { AuthCommonServiceImpl } from '../domain/use-cases/auth/service/AuthCommonServiceImpl';
import { SignInHelperFactory } from '../domain/use-cases/auth/sign-in/sign-in-factory/SignInHelperFactory';
import { SignInHelperFactoryImpl } from '../domain/use-cases/auth/sign-in/sign-in-factory/concrete/SignInHelperFactoryImpl';
import { SignInUseCase } from '../domain/use-cases/auth/sign-in/SignInUseCase';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Image',
        schema: ImageSchema,
      },
    ]),
    UserModule,
  ],
  controllers: [AuthControllerInjectedDecorator],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: HttpClient,
      useClass: HttpClientImpl,
    },
    {
      provide: ImageRepository,
      useClass: ImageRepositoryImpl,
    },
    {
      provide: HashProvider,
      useClass: HashProviderImpl,
    },
    {
      provide: GoogleAuthProvider,
      useClass: GoogleAuthProviderImpl,
    },
    {
      provide: SignInUseCase,
      useClass: SignInUseCaseImpl,
    },
    {
      provide: ReissueAccessTokenUseCase,
      useClass: ReissueAccessTokenUseCaseImpl,
    },
    {
      provide: SignOutUseCase,
      useClass: SignOutUseCaseImpl,
    },
    {
      provide: SignInHelperFactory,
      useClass: SignInHelperFactoryImpl,
    },
    {
      provide: AuthCommonService,
      useClass: AuthCommonServiceImpl,
    },
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [
    PassportModule,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
