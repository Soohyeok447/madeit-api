import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from '../adapter/app/AppController';
import { AuthModule } from './AuthModule';
import { UserModule } from './UserModule';
import {
  getDatabaseName,
  getDatabaseUrl,
  getEnvFilePath,
  getValidationSchema,
} from '../infrastructure/environment';
import { HttpModule } from '@nestjs/axios';
import { CartModule } from './CartModule';
import { OrderHistoryModule } from './OrderHistoryModule';
import { RoutineModule } from './RoutineModule';
import { AlarmModule } from './AlarmModule';
import { DatabaseModule, DatabaseService } from './DatabaseModule';
import { MongooseModule } from '@nestjs/mongoose';
import { E2EController } from './controllers/e2eController';
import { E2EModule } from './E2EModule';

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
    // DatabaseModule,
    UserModule,
    AuthModule,
    CartModule,
    OrderHistoryModule,
    RoutineModule,
    AlarmModule,
    HttpModule,
    TerminusModule,
    E2EModule,
  ],
  controllers: [AppController],
  providers: [DatabaseService],
})
export class AppModule { }
