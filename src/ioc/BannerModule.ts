import { Module } from '@nestjs/common';
import { AddBannerUseCase } from '../domain/use-cases/admin/add-banner/AddBannerUseCase';
import { AddBannerUseCaseImpl } from '../domain/use-cases/admin/add-banner/AddBannerUseCaseImpl';
import { BannerControllerInjectedDecorator } from './controllers/banner/BannerControllerInjectedDecorator';

@Module({
  imports: [],
  controllers: [BannerControllerInjectedDecorator],
  providers: [
    {
      provide: AddBannerUseCase,
      useClass: AddBannerUseCaseImpl,
    },
  ],
  exports: [],
})
export class BannerModule {}
