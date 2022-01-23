import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './users.module';
import { UserRepositoryImpl } from '../infrastructure/repositories/users.repository';
import { AuthController } from '../adapter/controllers/auth.controller';
import { AuthServiceImpl } from '../domain/auth/service/auth.service';
import { AuthService } from '../domain/auth/service/interface/auth.service';
import { JwtStrategy } from 'src/adapter/__common__/strategies/jwt.strategy';
import { JwtRefreshStrategy } from 'src/adapter/__common__/strategies/jwt_refresh.strategy';
import { UserRepository } from 'src/domain/__common__/repositories/user/users.repository';
import { HttpClient } from 'src/domain/__common__/providers/http_client.provider';
import { HttpClientImpl } from '../infrastructure/utils/providers/http_client';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/infrastructure/schemas/user.schema';
import { ImageRepository } from 'src/domain/__common__/repositories/image/image.repository';
import { ImageRepositoryImpl } from 'src/infrastructure/repositories/image.repository';
import { ImageSchema } from 'src/infrastructure/schemas/image.schema';

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
