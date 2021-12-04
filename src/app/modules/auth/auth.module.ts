import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/users.module';
import { UserRepository } from '../users/users.repository';
import { AuthController } from './auth.controller';
import { AuthServiceImpl } from './auth.service';
import { AuthService } from './interfaces/auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt_refresh.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserRepository]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useClass: AuthServiceImpl
    },
    GoogleStrategy,
    JwtStrategy,
    JwtRefreshStrategy
  ],
  exports: [
    PassportModule,
    {
      provide: AuthService,
      useClass: AuthServiceImpl,
    },
    GoogleStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ]
})
export class AuthModule { }
