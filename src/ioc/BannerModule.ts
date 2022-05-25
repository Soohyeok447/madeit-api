import { Module } from '@nestjs/common';
import { GetBannersUseCase } from '../domain/use-cases/banner/get-banners/GetBannersUseCase';
import { GetBannerUseCase } from '../domain/use-cases/banner/get-banner/GetBannerUseCase';
import { GetBannerUseCaseImpl } from '../domain/use-cases/banner/get-banner/GetBannerUseCaseImpl';
import { BannerControllerInjectedDecorator } from './controllers/banner/BannerControllerInjectedDecorator';
import { GetBannersUseCaseImpl } from '../domain/use-cases/banner/get-banners/GetBannersUseCaseImpl';

@Module({
  imports: [],
  controllers: [BannerControllerInjectedDecorator],
  providers: [
    {
      provide: GetBannerUseCase,
      useClass: GetBannerUseCaseImpl,
    },
    {
      provide: GetBannersUseCase,
      useClass: GetBannersUseCaseImpl,
    },
  ],
  exports: [],
})
export class BannerModule {}
