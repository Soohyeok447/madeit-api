import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { SignUpRequestDto } from '../../src/adapter/auth/sign-up/SignUpRequestDto';
import { HttpExceptionFilter } from '../../src/domain/common/filters/HttpExceptionFilter';
import { Provider } from '../../src/domain/use-cases/auth/common/types/provider';
import { onboard, signUp } from './request.index';

export async function InitApp(app: INestApplication, moduleRef: TestingModule) {
  app = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.init();

  return app;
}

export async function initSignUp(httpServer) {
  const signUpParam: SignUpRequestDto = {
    thirdPartyAccessToken: 'asdfasdfasdfasdf',
    username: '테스트입니다',
    age: 1,
    goal: 'e2e테스트중',
    statusMessage: '모든게 잘 될거야'
  };

  const res = await signUp(httpServer, Provider.kakao, signUpParam);
  
  return res;
}