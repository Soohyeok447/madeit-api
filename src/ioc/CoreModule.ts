import { Global, Injectable, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  getDatabaseName,
  getDatabaseUrl,
  getEnvFilePath,
  getValidationSchema,
} from '../infrastructure/environment';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Global()
@Injectable()
export class DatabaseService {
  public constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  public getConnection(): Connection {
    return this.connection;
  }
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePath(),
      validationSchema: getValidationSchema(),
    }),
    MongooseModule.forRoot(getDatabaseUrl(), {
      dbName: getDatabaseName(),
    }),
  ],
  controllers: [],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class CoreModule {}
