import { Injectable, Module } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { E2EController } from './controllers/e2eController';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../adapter/common/strategies/JwtStrategy';
import { PassportModule } from '@nestjs/passport';
import { JwtProvider } from '../domain/providers/JwtProvider';
import { JwtProviderImpl } from '../infrastructure/providers/JwtProviderImpl';

@Injectable()
export class DatabaseService {
  public constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  public getConnection(): Connection {
    return this.connection;
  }
}

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [E2EController],
  providers: [
    {
      provide: JwtProvider,
      useClass: JwtProviderImpl,
    },
    JwtStrategy,
  ],
  exports: [],
})
export class E2EModule {}
