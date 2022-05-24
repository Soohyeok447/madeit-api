import { Injectable } from '@nestjs/common';
import { Banner } from '../../../../entities/Banner';
import { LoggerProvider } from '../../../../providers/LoggerProvider';
import { BannerRepository } from '../../../../repositories/banner/BannerRepository';
import { BannerNotFoundException } from '../../common/exceptions/BannerNotFoundException';
import { DeleteBannerUseCase } from '../DeleteBannerUseCase';
import { DeleteBannerResponseDto } from '../dtos/DeleteBannerResponseDto';
import { DeleteBannerUseCaseParams } from '../dtos/DeleteBannerUseCaseParams';

@Injectable()
export class MockDeleteBannerUseCaseImpl implements DeleteBannerUseCase {
  public constructor(
    private readonly logger: LoggerProvider,
    private readonly bannerRepository: BannerRepository,
  ) {}

  public async execute({
    bannerId,
  }: DeleteBannerUseCaseParams): Promise<DeleteBannerResponseDto> {
    this.logger.setContext('mockDeleteBanner');

    const banner: Banner = await this.bannerRepository.findOne(bannerId);

    if (!banner) {
      throw new BannerNotFoundException(
        this.logger.getContext(),
        '존재하지 않는 배너입니다',
      );
    }

    this.bannerRepository.delete(bannerId);

    return {};
  }
}
