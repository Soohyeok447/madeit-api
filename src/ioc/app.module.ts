import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from '../adapter/controllers/app.controller';
import { AuthModule } from './auth.module';
import { UserModule } from './users.module';
import {
  getDatabaseName,
  getDatabaseUrl,
  getEnvironment,
  getValidationSchema,
} from '../infrastructure/environment';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from './cart.module';
import { OrderHistoryModule } from './order_history.module';
import { RoutineModule } from './routine.module';
import { ScheduleModule } from './schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvironment(),
      validationSchema: getValidationSchema(),
    }),
    MongooseModule.forRoot(getDatabaseUrl(), {
      dbName: getDatabaseName(),
    }),
    UserModule,
    AuthModule,
    CartModule,
    OrderHistoryModule,
    RoutineModule,
    ScheduleModule,
    HttpModule,
    TerminusModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
