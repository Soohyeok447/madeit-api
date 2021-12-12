import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users.module';
import { UserRepositoryImpl } from '../repositories/database/users.repository';
import { AuthController } from '../../adapter/controllers/auth.controller';
import { AuthServiceImpl } from '../../domain/services/auth.service';
import { AuthService } from '../../domain/services/interfaces/auth.service';
import { JwtStrategy } from 'src/adapter/common/strategies/jwt.strategy';
import { JwtRefreshStrategy } from 'src/adapter/common/strategies/jwt_refresh.strategy';
import { UserRepository } from 'src/domain/repositories/database/users.repository';
import { User } from '../entities/user.entity';
import { HttpClient } from 'src/domain/repositories/network/network';
import { HttpClientImpl } from '../repositories/network/network';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
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
