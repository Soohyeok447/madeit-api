import { Injectable } from '@nestjs/common';
import { LoggerProvider } from '../../../../providers/LoggerProvider';
import { GetBannersResponseDto } from '../dtos/GetBannersResponseDto';
import { GetBannersUseCase } from '../GetBannersUseCase';
import { BannerRepository } from '../../../../repositories/banner/BannerRepository';
import { Banner } from '../../../../entities/Banner';
import { BannerNotFoundException } from '../../common/exceptions/BannerNotFoundException';

@Injectable()
export class MockGetBannersUseCaseImpl implements GetBannersUseCase {
  public constructor(
    private readonly logger: LoggerProvider,
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
        return {
          id: e.id,
          title: e.title,
          contentVideoId: e.contentVideoId,
          bannerImageUrl: 'bannerImageUrl',
        };
      }),
    );
  }
}
