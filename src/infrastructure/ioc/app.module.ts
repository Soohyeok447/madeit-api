import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from '../../adapter/controllers/app.controller';
import { AuthModule } from './auth.module';
import { UserModule } from './users.module';
import {
  getEnvironment,
  getIgnoreEnvFile,
  getTypeOrmModule,
  getValidationSchema,
} from '../environment';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvironment(),
      ignoreEnvFile: getIgnoreEnvFile(),
      validationSchema: getValidationSchema(),
    }),
    getTypeOrmModule(),
    UserModule,
    AuthModule,
    HttpModule,
    TerminusModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
