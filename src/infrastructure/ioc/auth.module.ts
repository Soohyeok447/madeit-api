import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users.module';
import { UserRepository } from '../repositories/users.repository';
import { AuthController } from '../../adapter/controllers/auth.controller';
import { AuthServiceImpl } from '../../domain/services/auth.service';
import { AuthService } from '../../adapter/services/auth.service';
import { JwtStrategy } from 'src/adapter/common/strategies/jwt.strategy';
import { JwtRefreshStrategy } from 'src/adapter/common/strategies/jwt_refresh.strategy';



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
