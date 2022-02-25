import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import { HttpExceptionFilter } from "../../src/domain/common/filters/HttpExceptionFilter";
import { onboard } from "./request.index";

export async function InitApp(app: INestApplication, moduleRef: TestingModule) {
  app = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.init();

  return app;
}

export async function initOnboarding(httpServer: any, accessToken: string) {
  const onboardParam = {
    username: "테스트",
    birth: "0000-00-00",
    job: "student",
    gender: "male"
  };

  await onboard(httpServer, accessToken, onboardParam);
}