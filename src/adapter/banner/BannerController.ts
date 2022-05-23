import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { GetBannerResponseDto } from '../../domain/use-cases/banner/get-banner/dtos/GetBannerResponseDto';
import { GetBannerUseCase } from '../../domain/use-cases/banner/get-banner/GetBannerUseCase';
import { GetBannersResponseDto } from '../../domain/use-cases/banner/get-banners/dtos/GetBannersResponseDto';
import { GetBannersUseCase } from '../../domain/use-cases/banner/get-banners/GetBannersUseCase';

@Injectable()
export class BannerController {
  public constructor(
    private readonly getBannerUseCase: GetBannerUseCase,
    private readonly getBannersUseCase: GetBannersUseCase,
  ) {}

  public async getBanner(req: Request): Promise<GetBannerResponseDto> {
    return this.getBannerUseCase.execute({
      bannerId: req.params['id'],
    });
  }

  public async getBanners(): Promise<GetBannersResponseDto[]> {
    return this.getBannersUseCase.execute({});
  }
}
