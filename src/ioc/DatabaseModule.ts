import { Injectable, Module } from '@nestjs/common';
import { getDatabaseName, getDatabaseUrl } from '../infrastructure/environment';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService {
  public constructor(@InjectConnection() private readonly connection: Connection) {}

  public getConnection(): Connection {
    return this.connection;
  }
}

@Module({
  imports: [
    MongooseModule.forRoot(getDatabaseUrl(), {
      dbName: getDatabaseName(),
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
