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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvironment(),
      validationSchema: getValidationSchema(),
    }),
    MongooseModule.forRoot(
      getDatabaseUrl(), {
      dbName: getDatabaseName(),
    }),
    UserModule,
    AuthModule,
    HttpModule,
    TerminusModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
