import { Injectable } from '@nestjs/common';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { GetBannersResponseDto } from './dtos/GetBannersResponseDto';
import { GetBannersUseCase } from './GetBannersUseCase';
import { BannerRepository } from '../../../repositories/banner/BannerRepository';
import { Banner } from '../../../entities/Banner';
import { ImageProviderV2 } from '../../../providers/ImageProviderV2';
import { BannerNotFoundException } from '../common/exceptions/BannerNotFoundException';
import { ImageRepositoryV2 } from '../../../repositories/imageV2/ImageRepositoryV2';
import { ImageV2 } from '../../../entities/ImageV2';

@Injectable()
export class GetBannersUseCaseImpl implements GetBannersUseCase {
  public constructor(
    private readonly logger: LoggerProvider,
    private readonly imageProviderV2: ImageProviderV2,
    private readonly imageRepositoryV2: ImageRepositoryV2,
    private readonly bannerRepository: BannerRepository,
  ) {}

  public async execute(): Promise<GetBannersResponseDto[]> {
    this.logger.setContext('getBanners');

    const banners: Banner[] = await this.bannerRepository.findAll();

    if (!banners.length) {
      throw new BannerNotFoundException(
        this.logger.getContext(),
        '최소 한개의 배너도 존재하지 않음',
      );
    }

    return await Promise.all(
      banners.map(async (e) => {
        const bannerImage: ImageV2 = await this.imageRepositoryV2.findOne(
          e.bannerImageId,
        );

        const bannerImageUrl: string = await this.imageProviderV2.getImageUrl(
          bannerImage,
        );

        return {
          id: e.id,
          title: e.title,
          contentVideoId: e.contentVideoId,
          bannerImageUrl,
        };
      }),
    );
  }
}
