import { Injectable } from '@nestjs/common';
import { ImageProvider } from '../../../providers/ImageProvider';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { YoutubeProvider } from '../../../providers/YoutubeProvider';
import { HttpClientImpl } from '../../../../infrastructure/providers/HttpClientImpl';

@Injectable()
export class SetThumbnailUseCaseImpl {
  public constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
    private readonly _logger: LoggerProvider,
    private readonly youtubeProvider: YoutubeProvider,
  ) {}

  public async execute(): Promise<any> {
    const youtubeApiUrl: any = 'https://www.googleapis.com/youtube/v3';
    const videosApiUrl: any = `${youtubeApiUrl}/videos`;

    const HttpClient: HttpClientImpl = new HttpClientImpl();

    const existingRecommendedRoutines: RecommendedRoutine[] =
      await this._recommendedRoutineRepository.findAll(200);

    existingRecommendedRoutines.forEach(async (e) => {
      const callVideosApiResult: any = await HttpClient.get(
        videosApiUrl,
        null,
        {
          key: process.env.GOOGLE_API_KEY_NODE,
          part: 'snippet',
          id: e['contentVideoId'],
        },
      );

      await this._recommendedRoutineRepository.update(e.id, {
        youtubeThumbnail:
          callVideosApiResult.data.items[0].snippet.thumbnails.high.url,
      });
    });

    return {};
  }
}
