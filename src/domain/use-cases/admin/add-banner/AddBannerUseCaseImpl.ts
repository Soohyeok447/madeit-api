import { Injectable } from '@nestjs/common';
import { Admin } from '../../../entities/Admin';
import {
  AdminAuthProvider,
  Payload,
} from '../../../providers/AdminAuthProvider';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { AdminRepository } from '../../../repositories/admin/AdminRepository';
import { AdminNotFoundException } from '../common/exceptions/AdminNotFoundException';
import { InvalidAdminTokenException } from '../common/exceptions/InvalidAdminTokenException';
import { AddBannerResponseDto } from './dtos/AddBannerResponseDto';
import { AddBannerUseCaseParams } from './dtos/AddBannerUseCaseParams';
import { AddBannerUseCase } from './AddBannerUseCase';
import { BannerRepository } from '../../../repositories/banner/BannerRepository';
import { Banner } from '../../../entities/Banner';
import { ImageProviderV2 } from '../../../providers/ImageProviderV2';
import { ImageRepositoryV2 } from '../../../repositories/imageV2/ImageRepositoryV2';
import { ImageV2 } from '../../../entities/ImageV2';

@Injectable()
export class AddBannerUseCaseImpl implements AddBannerUseCase {
  public constructor(
    private readonly logger: LoggerProvider,
    private readonly adminRepository: AdminRepository,
    private readonly adminAuthProvider: AdminAuthProvider,
    private readonly imageProviderV2: ImageProviderV2,
    private readonly imageRepositoryV2: ImageRepositoryV2,
    private readonly bannerRepository: BannerRepository,
  ) {}

  public async execute({
    accessToken,
    title,
    bannerImageId,
    contentVideoId,
  }: AddBannerUseCaseParams): Promise<AddBannerResponseDto> {
    this.logger.setContext('addBanner');

    const payload: Payload =
      this.adminAuthProvider.verifyAccessToken(accessToken);

    if (!payload)
      throw new InvalidAdminTokenException(
        this.logger.getContext(),
        `유효하지않은 어드민 토큰입니다.`,
      );

    const admin: Admin = await this.adminRepository.findOneByIndentifier(
      payload.id,
    );

    if (!admin)
      throw new AdminNotFoundException(
        this.logger.getContext(),
        `존재하지 않는 어드민`,
      );

    //banner repository 필요
    const banner: Banner = await this.bannerRepository.save({
      title,
      contentVideoId,
      bannerImageId,
    });

    const bannerImage: ImageV2 = await this.imageRepositoryV2.findOne(
      banner.bannerImageId,
    );

    const bannerImageUrl: string = await this.imageProviderV2.getImageUrl(
      bannerImage,
    );

    return {
      id: banner.id,
      title: banner.title,
      contentVideoId: banner.contentVideoId,
      bannerImageUrl,
    };
  }
}
