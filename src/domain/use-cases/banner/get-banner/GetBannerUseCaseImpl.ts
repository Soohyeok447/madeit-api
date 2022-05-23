import { Injectable } from '@nestjs/common';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { GetBannerResponseDto } from './dtos/GetBannerResponseDto';
import { GetBannerUseCaseParams } from './dtos/GetBannerUseCaseParams';
import { GetBannerUseCase } from './GetBannerUseCase';
import { BannerRepository } from '../../../repositories/banner/BannerRepository';
import { Banner } from '../../../entities/Banner';
import { ImageProviderV2 } from '../../../providers/ImageProviderV2';
import { BannerNotFoundException } from '../common/exceptions/BannerNotFoundException';
import { ImageRepositoryV2 } from '../../../repositories/imageV2/ImageRepositoryV2';
import { ImageV2 } from '../../../entities/ImageV2';

@Injectable()
export class GetBannerUseCaseImpl implements GetBannerUseCase {
  public constructor(
    private readonly logger: LoggerProvider,
    private readonly imageProviderV2: ImageProviderV2,
    private readonly imageRepositoryV2: ImageRepositoryV2,
    private readonly bannerRepository: BannerRepository,
  ) {}

  public async execute({
    bannerId,
  }: GetBannerUseCaseParams): Promise<GetBannerResponseDto> {
    this.logger.setContext('getBanner');

    const banner: Banner = await this.bannerRepository.findOne(bannerId);

    if (!banner) {
      throw new BannerNotFoundException(
        this.logger.getContext(),
        '존재하지 않는 배너입니다',
      );
    }

    const bannerImage: ImageV2 = await this.imageRepositoryV2.findOne(
      banner.bannerImageId,
    );

    const bannerImageUrl: string = await this.imageProviderV2.getImageUrl(
      bannerImage,
    );

    return {
      id: banner.id,
      title: banner.title,
      views: banner.views,
      contentVideoId: banner.contentVideoId,
      bannerImageUrl,
    };
  }
}
