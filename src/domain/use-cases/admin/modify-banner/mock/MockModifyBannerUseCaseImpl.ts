import { Injectable } from '@nestjs/common';
import { Banner } from '../../../../entities/Banner';
import { LoggerProvider } from '../../../../providers/LoggerProvider';
import { BannerRepository } from '../../../../repositories/banner/BannerRepository';
import { ModifyBannerResponseDto } from '../dtos/ModifyBannerResponseDto';
import { ModifyBannerUseCaseParams } from '../dtos/ModifyBannerUseCaseParams';
import { ModifyBannerUseCase } from '../ModifyBannerUseCase';

@Injectable()
export class MockModifyBannerUseCaseImpl implements ModifyBannerUseCase {
  public constructor(
    private readonly logger: LoggerProvider,
    private readonly bannerRepository: BannerRepository,
  ) {}

  public async execute({
    bannerId,
    title,
    bannerImageId,
    contentVideoId,
  }: ModifyBannerUseCaseParams): Promise<ModifyBannerResponseDto> {
    this.logger.setContext('mockModifyBanner');

    //banner repository 필요
    const banner: Banner = await this.bannerRepository.modify(bannerId, {
      title,
      contentVideoId,
      bannerImageId,
    });

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const bannerImageUrl: string = 'test banner image url';

    return {
      id: banner.id,
      title: banner.title,
      contentVideoId: banner.contentVideoId,
      bannerImageUrl,
    };
  }
}
