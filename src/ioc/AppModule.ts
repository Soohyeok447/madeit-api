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
import { DatabaseService } from './DatabaseModule';
import { MongooseModule } from '@nestjs/mongoose';
import { E2EModule } from './E2EModule';
import { VideoModule } from './VideoModule';
import { RecommendedRoutineModule } from './RecommendedRoutineModule';
import { VersionModule } from './VersionModule';
import { AppControllerInjectedDecorator } from './controllers/app/AppControllerInjectedDecorator';

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
    VersionModule,
    UserModule,
    AuthModule,
    CartModule,
    OrderHistoryModule,
    RoutineModule,
    HttpModule,
    TerminusModule,
    E2EModule,
    VideoModule,
    RecommendedRoutineModule,
  ],
  controllers: [AppControllerInjectedDecorator],
  providers: [DatabaseService],
})
export class AppModule {}
