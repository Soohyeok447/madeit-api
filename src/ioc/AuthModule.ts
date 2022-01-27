import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './UserModule';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { AuthController } from '../adapter/controllers/AuthController';
import { JwtStrategy } from 'src/adapter/common/strategies/JwtStrategy';
import { JwtRefreshStrategy } from 'src/adapter/common/strategies/JwtRefreshStrategy';

import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/infrastructure/schemas/UserSchema';
import { ImageRepositoryImpl } from 'src/infrastructure/repositories/ImageRepositoryImpl';
import { ImageSchema } from 'src/infrastructure/schemas/ImageSchema';
import { AuthService } from 'src/domain/use-cases/auth/service/interface/AuthService';
import { AuthServiceImpl } from 'src/domain/use-cases/auth/service/AuthServiceImpl';
import { UserRepository } from 'src/domain/repositories/user/UserRepository';
import { ImageRepository } from 'src/domain/repositories/image/ImageRepository';
import { HttpClientImpl } from 'src/infrastructure/providers/HttpClientImpl';
import { HttpClient } from 'src/domain/providers/HttpClient';
import { HashProvider } from 'src/domain/providers/HashProvider';
import { HashProviderImpl } from 'src/infrastructure/providers/HashProviderImpl';
import { GoogleAuthProvider } from 'src/domain/providers/GoogleAuthProvider';
import { GoogleAuthProviderImpl } from 'src/infrastructure/providers/GoogleAuthProviderImpl';

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
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useClass: AuthServiceImpl,
    },
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
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [
    PassportModule,
    {
      provide: AuthService,
      useClass: AuthServiceImpl,
    },
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
