import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../../adapter/controllers/app.controller';
import { AppService } from '../../domain/services/app.service';
import { AuthModule } from './auth.module';
import { UserModule } from './users.module';
import { setEnvironment, setIgnoreEnvFile, setTypeOrmModule, setValidationSchema } from '../environment';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
