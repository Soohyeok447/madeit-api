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
import { DeleteBannerResponseDto } from './dtos/DeleteBannerResponseDto';
import { DeleteBannerUseCaseParams } from './dtos/DeleteBannerUseCaseParams';
import { DeleteBannerUseCase } from './DeleteBannerUseCase';
import { BannerRepository } from '../../../repositories/banner/BannerRepository';
import { Banner } from '../../../entities/Banner';
import { ImageProviderV2 } from '../../../providers/ImageProviderV2';
import { ImageRepositoryV2 } from '../../../repositories/imageV2/ImageRepositoryV2';
import { BannerNotFoundException } from '../common/exceptions/BannerNotFoundException';

@Injectable()
export class DeleteBannerUseCaseImpl implements DeleteBannerUseCase {
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
    bannerId,
  }: DeleteBannerUseCaseParams): Promise<DeleteBannerResponseDto> {
    this.logger.setContext('deleteBanner');

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

    const banner: Banner = await this.bannerRepository.findOne(bannerId);

    if (!banner) {
      throw new BannerNotFoundException(
        this.logger.getContext(),
        '존재하지 않는 배너입니다',
      );
    }

    this.imageRepositoryV2.delete(banner.bannerImageId);

    this.bannerRepository.delete(bannerId);

    return {};
  }
}
