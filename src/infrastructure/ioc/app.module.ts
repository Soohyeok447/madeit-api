import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from '../../adapter/controllers/app.controller';
import { AuthModule } from './auth.module';
import { UserModule } from './users.module';
import {
  setEnvironment,
  setIgnoreEnvFile,
  setTypeOrmModule,
  setValidationSchema,
} from '../environment';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: setEnvironment(),
      ignoreEnvFile: setIgnoreEnvFile(),
      validationSchema: setValidationSchema(),
    }),
    setTypeOrmModule(),
    UserModule,
    AuthModule,
    HttpModule,
    TerminusModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
