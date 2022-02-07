import { Injectable, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../adapter/app/AppController';
import {
  getDatabaseName,
  getDatabaseUrl,
} from '../infrastructure/environment';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { E2EController } from './controllers/e2eController';
import { UserRepository } from 'src/domain/repositories/user/UserRepository';
import { UserRepositoryImpl } from 'src/infrastructure/repositories/UserRepositoryImpl';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserSchema } from 'src/infrastructure/schemas/UserSchema';
import { JwtStrategy } from 'src/adapter/common/strategies/JwtStrategy';
import { JwtRefreshStrategy } from 'src/adapter/common/strategies/JwtRefreshStrategy';
import { PassportModule } from '@nestjs/passport';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) { }

  public getConnection(): Connection {
    return this.connection;
  }
}

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [E2EController],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl
    },
    JwtStrategy,
  ],
  exports: []
})
export class E2EModule { }

