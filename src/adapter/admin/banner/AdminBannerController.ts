import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AddBannerUseCase } from '../../../domain/use-cases/admin/banner/add-banner/AddBannerUseCase';
import { AddBannerResponseDto } from '../../../domain/use-cases/admin/banner/add-banner/dtos/AddBannerResponseDto';
import { AddBannerUseCaseParams } from '../../../domain/use-cases/admin/banner/add-banner/dtos/AddBannerUseCaseParams';
import { DeleteBannerUseCase } from '../../../domain/use-cases/admin/banner/delete-banner/DeleteBannerUseCase';
import { DeleteBannerResponseDto } from '../../../domain/use-cases/admin/banner/delete-banner/dtos/DeleteBannerResponseDto';
import { DeleteBannerUseCaseParams } from '../../../domain/use-cases/admin/banner/delete-banner/dtos/DeleteBannerUseCaseParams';
import { ModifyBannerResponseDto } from '../../../domain/use-cases/admin/banner/modify-banner/dtos/ModifyBannerResponseDto';
import { ModifyBannerUseCaseParams } from '../../../domain/use-cases/admin/banner/modify-banner/dtos/ModifyBannerUseCaseParams';
import { ModifyBannerUseCase } from '../../../domain/use-cases/admin/banner/modify-banner/ModifyBannerUseCase';
import { AddBannerRequestDto } from './add-banner/AddBannerRequestDto';
import { ModifyBannerRequestDto } from './modify-banner/ModifyBannerRequestDto';

@Injectable()
export class AdminBannerController {
  public constructor(
    private readonly addBannerUseCase: AddBannerUseCase,
    private readonly modifyBannerUseCase: ModifyBannerUseCase,
    private readonly deleteBannerUseCase: DeleteBannerUseCase,
  ) {}

  public async addBanner(
    { title, bannerImageId, contentVideoId }: AddBannerRequestDto,
    req: Request,
  ): Promise<AddBannerResponseDto> {
    const input: AddBannerUseCaseParams = {
      accessToken: req.cookies ? req.cookies['accessToken'] : null,
      title,
      bannerImageId,
      contentVideoId,
    };

    return await this.addBannerUseCase.execute(input);
  }

  public async modifyBanner(
    { title, bannerImageId, contentVideoId }: ModifyBannerRequestDto,
    req: Request,
  ): Promise<ModifyBannerResponseDto> {
    const input: ModifyBannerUseCaseParams = {
      accessToken: req.cookies ? req.cookies['accessToken'] : null,
      title,
      bannerId: req.params['id'],
      bannerImageId,
      contentVideoId,
    };

    return await this.modifyBannerUseCase.execute(input);
  }

  public async deleteBanner(req: Request): Promise<DeleteBannerResponseDto> {
    const input: DeleteBannerUseCaseParams = {
      accessToken: req.cookies ? req.cookies['accessToken'] : null,
      bannerId: req.params['id'],
    };

    return await this.deleteBannerUseCase.execute(input);
  }
}
