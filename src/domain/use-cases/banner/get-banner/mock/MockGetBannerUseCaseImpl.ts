import { Injectable } from '@nestjs/common';
import { LoggerProvider } from '../../../../providers/LoggerProvider';
import { GetBannerResponseDto } from '../dtos/GetBannerResponseDto';
import { GetBannerUseCaseParams } from '../dtos/GetBannerUseCaseParams';
import { GetBannerUseCase } from '../GetBannerUseCase';
import { BannerRepository } from '../../../../repositories/banner/BannerRepository';
import { Banner } from '../../../../entities/Banner';
import { BannerNotFoundException } from '../../common/exceptions/BannerNotFoundException';

@Injectable()
export class MockGetBannerUseCaseImpl implements GetBannerUseCase {
  public constructor(
    private readonly logger: LoggerProvider,
    private readonly bannerRepository: BannerRepository,
  ) {}

  public async execute({
    bannerId,
  }: GetBannerUseCaseParams): Promise<GetBannerResponseDto> {
    this.logger.setContext('mockGetBanner');

    const banner: Banner = await this.bannerRepository.findOne(bannerId);

    if (!banner) {
      throw new BannerNotFoundException(
        this.logger.getContext(),
        '존재하지 않는 배너입니다',
      );
    }
    // eslint-disable-next-line @typescript-eslint/typedef
    const bannerImageUrl = 'https://test.com';

    return {
      id: banner.id,
      title: banner.title,
      contentVideoId: banner.contentVideoId,
      bannerImageUrl,
    };
  }
}
