import { Module } from '@nestjs/common';
import { HtmlEntitiesProvider } from '../domain/providers/HtmlEntitiesProvider';
import { YoutubeProvider } from '../domain/providers/YoutubeProvider';
import { SearchVideoByKeywordUseCase } from '../domain/use-cases/video/search-video-by-keyword/SearchVideoByKeywordUseCase';
import { SearchVideoByKeywordUseCaseImpl } from '../domain/use-cases/video/search-video-by-keyword/SearchVideoByKeywordUseCaseImpl';
import { HtmlEntitiesProviderImpl } from '../infrastructure/providers/HtmlEntitiesProviderImpl';
import { YoutubeProviderImpl } from '../infrastructure/providers/YoutubeProviderImpl';
import { VideoControllerInjectedDecorator } from './controllers/video/VideoControllerInjectedDecorator';

@Module({
  imports: [],
  controllers: [VideoControllerInjectedDecorator],
  providers: [
    {
      provide: SearchVideoByKeywordUseCase,
      useClass: SearchVideoByKeywordUseCaseImpl,
    },
    {
      provide: YoutubeProvider,
      useClass: YoutubeProviderImpl,
    },
    {
      provide: HtmlEntitiesProvider,
      useClass: HtmlEntitiesProviderImpl,
    },
  ],
  exports: [],
})
export class VideoModule {}
