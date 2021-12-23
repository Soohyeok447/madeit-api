import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './users.module';
import { UserRepositoryImpl } from '../infrastructure/repositories/users.repository';
import { AuthController } from '../adapter/controllers/auth.controller';
import { AuthServiceImpl } from '../domain/services/auth.service';
import { AuthService } from '../domain/services/interfaces/auth.service';
import { JwtStrategy } from 'src/adapter/common/strategies/jwt.strategy';
import { JwtRefreshStrategy } from 'src/adapter/common/strategies/jwt_refresh.strategy';
import { UserRepository } from 'src/domain/repositories/users.repository';
import { HttpClient } from 'src/infrastructure/utils/http_client/interface/http_client';
import { HttpClientImpl } from '../infrastructure/utils/http_client/http_client';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/infrastructure/schemas/user.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    MongooseModule.forFeature([
      {
        name: 'User', schema: UserSchema
      }
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
