import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/users.module';
import { UserRepository } from '../users/users.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt_refresh.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: `${process.env.JWT_ACCESS_TOKEN_SECRET}`,
            signOptions: {
                expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
                issuer: `${process.env.JWT_ISSUER}`
            }
        }),
        TypeOrmModule.forFeature([UserRepository]),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
    exports: [PassportModule, AuthService, JwtStrategy, JwtRefreshStrategy]
})
export class AuthModule { }
