import { Injectable, Module } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { E2EController } from './controllers/e2eController';
import { UserRepository } from '../domain/repositories/user/UserRepository';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { JwtStrategy } from '../adapter/common/strategies/JwtStrategy';
import { PassportModule } from '@nestjs/passport';
import { JwtProvider } from '../domain/providers/JwtProvider';
import { JwtProviderImpl } from '../infrastructure/providers/JwtProviderImpl';
import { ImageRepository } from '../domain/repositories/image/ImageRepository';
import { ImageRepositoryImpl } from '../infrastructure/repositories/ImageRepositoryImpl';
import { ImageSchema } from '../infrastructure/schemas/ImageSchema';

@Injectable()
export class DatabaseService {
  public constructor(@InjectConnection() private readonly connection: Connection) {}

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
      {
        name: 'Image',
        schema: ImageSchema,
      },
    ]),
  ],
  controllers: [E2EController],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: JwtProvider,
      useClass: JwtProviderImpl,
    },
    {
      provide: ImageRepository,
      useClass: ImageRepositoryImpl,
    },
    JwtStrategy,
  ],
  exports: [],
})
export class E2EModule {}
