import { Injectable } from '@nestjs/common';
import { Banner } from '../../../../../entities/Banner';
import { LoggerProvider } from '../../../../../providers/LoggerProvider';
import { BannerRepository } from '../../../../../repositories/banner/BannerRepository';
import { AddBannerUseCase } from '../AddBannerUseCase';
import { AddBannerResponseDto } from '../dtos/AddBannerResponseDto';
import { AddBannerUseCaseParams } from '../dtos/AddBannerUseCaseParams';

@Injectable()
export class MockAddBannerUseCaseImpl implements AddBannerUseCase {
  public constructor(
    private readonly logger: LoggerProvider,
    private readonly bannerRepository: BannerRepository,
  ) {}

  public async execute({
    title,
    bannerImageId,
    contentVideoId,
  }: AddBannerUseCaseParams): Promise<AddBannerResponseDto> {
    this.logger.setContext('mockAddBanner');

    //banner repository 필요
    const banner: Banner = await this.bannerRepository.save({
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
