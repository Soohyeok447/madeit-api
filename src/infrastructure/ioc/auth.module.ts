import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users.module';
import { UserRepository } from '../../app/modules/users/users.repository';
import { AuthController } from '../../app/modules/auth/auth.controller';
import { AuthServiceImpl } from '../../app/modules/auth/auth.service';
import { AuthService } from '../../app/modules/auth/interfaces/auth.service';
import { JwtStrategy } from '../../app/modules/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../../app/modules/auth/strategies/jwt_refresh.strategy';

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
    JwtStrategy,
    JwtRefreshStrategy
  ],
  exports: [
    PassportModule,
    {
      provide: AuthService,
      useClass: AuthServiceImpl,
    },
    JwtStrategy,
    JwtRefreshStrategy,
  ]
})
export class AuthModule { }
