import { HttpResponse } from '../../domain/providers/HttpClient';
import { LoggerProvider } from '../../domain/providers/LoggerProvider';
import {
  CallVideosApiResult,
  SearchApiParams,
  VideoApiParams,
  YoutubeProvider,
} from '../../domain/providers/YoutubeProvider';
import { QuotaExceededException } from './exceptions/youtube-provider/QuotaExceededException';
import { SocketHangUpException } from './exceptions/youtube-provider/SocketHangUpException';
import { YoutubeForbiddenException } from './exceptions/youtube-provider/YoutubeForbiddenException';
import { HttpClientImpl } from './HttpClientImpl';

export class YoutubeProviderImpl implements YoutubeProvider {
  public constructor(private readonly _logger: LoggerProvider) {}

  public async getThumbnailUrl(id: string): Promise<string> {
    const videosApiUrl: any = `https://www.googleapis.com/youtube/v3/videos`;

    const HttpClient: HttpClientImpl = new HttpClientImpl();

    const callVideosApiResult: any = await HttpClient.get(videosApiUrl, null, {
      key: process.env.GOOGLE_API_KEY_NODE,
      part: 'snippet',
      id,
    });

    return callVideosApiResult.data.items[0].snippet.thumbnails.high.url;
  }

  public async searchByKeyword(
    keyword: string,
    maxResults: number,
  ): Promise<CallVideosApiResult[]> {
    const youtubeApiUrl: any = 'https://www.googleapis.com/youtube/v3';
    const searchApiUrl: any = `${youtubeApiUrl}/search`;
    const videosApiUrl: any = `${youtubeApiUrl}/videos`;

    const HttpClient: HttpClientImpl = new HttpClientImpl();

    const searchApiParams: SearchApiParams = this._mapToSearchparams(
      maxResults,
      keyword,
    );

    const callSearchApiResult: HttpResponse<any> = await this._callSearchApi(
      HttpClient,
      searchApiUrl,
      searchApiParams,
    );

    if (!callSearchApiResult.data.items.length) return [];

    const mappedCallVideosApiResult: CallVideosApiResult[] = await Promise.all(
      callSearchApiResult.data.items.map(async (e) => {
        const videosApiParams: VideoApiParams = this._mapToVideosParams(e);

        const callVideosApiResult: HttpResponse<any> =
          await this._callVideosApi(HttpClient, videosApiUrl, videosApiParams);

        const replacedDuration: number =
          this._convertDurationToSecond(callVideosApiResult);

        return this._mapCallVideosApiResult(e, replacedDuration);
      }),
    );

    return mappedCallVideosApiResult;
  }

  private async _callVideosApi(
    HttpClient: HttpClientImpl,
    videosApiUrl: string,
    videosParams: VideoApiParams,
  ): Promise<HttpResponse<any>> {
    try {
      return await HttpClient.get(videosApiUrl, null, videosParams);
    } catch (err) {
      if (err.code === 'ECONNRESET') {
        throw new SocketHangUpException(
          this._logger.getContext(),
          `네트워크 연결이 불안정`,
        );
      }

      if (
        err.response.data.error.code === 403 &&
        err.response.data.error.errors[0].reason === 'quotaExceeded'
      ) {
        throw new QuotaExceededException(
          this._logger.getContext(),
          `유튜브 API 할당량 초과`,
        );
      }
      if (
        err.response.data.error.code === 403 &&
        err.response.data.error.errors[0].reason === 'forbidden'
      ) {
        throw new YoutubeForbiddenException(
          this._logger.getContext(),
          `유튜브 API KEY에 문제 발생`,
        );
      }
    }
  }

  private async _callSearchApi(
    HttpClient: HttpClientImpl,
    searchApiUrl: string,
    searchParams: SearchApiParams,
  ): Promise<HttpResponse<any>> {
    try {
      return await HttpClient.get(searchApiUrl, null, searchParams);
    } catch (err) {
      if (err.code === 'ECONNRESET') {
        throw new SocketHangUpException(
          this._logger.getContext(),
          `네트워크 연결이 불안정`,
        );
      }
      if (
        err.response.data.error.code === 403 &&
        err.response.data.error.errors[0].reason === 'quotaExceeded'
      ) {
        throw new QuotaExceededException(
          this._logger.getContext(),
          `유튜브 API 할당량 초과`,
        );
      }
      if (
        err.response.data.error.code === 403 &&
        err.response.data.error.errors[0].reason === 'forbidden'
      ) {
        throw new YoutubeForbiddenException(
          this._logger.getContext(),
          `유튜브 API KEY에 문제 발생`,
        );
      }
    }
  }

  private _mapCallVideosApiResult(
    e: any,
    durationParts: any,
  ): CallVideosApiResult {
    return {
      videoId: e.id.videoId,
      title: unescape(e.snippet.title),
      thumbnail: e.snippet.thumbnails.high.url,
      channel: e.snippet.channelTitle,
      duration: durationParts,
    };
  }

  private _mapToVideosParams(e: any): VideoApiParams {
    return {
      key: process.env.GOOGLE_API_KEY_NODE,
      part: 'contentDetails',
      id: e.id.videoId,
    };
  }

  private _mapToSearchparams(
    maxResults: number,
    keyword: string,
  ): SearchApiParams {
    return {
      key: process.env.GOOGLE_API_KEY_NODE,
      part: 'snippet',
      maxResults,
      order: 'relevance',
      regionCode: 'KR',
      type: 'video',
      q: decodeURIComponent(keyword),
    };
  }

  private _convertDurationToSecond(result: any): number {
    const splicedDuration: string = result.data.items[0].contentDetails.duration
      .replace('PT', '')
      .replace('H', ':')
      .replace('M', ':')
      .replace('S', '')
      .split(':');

    if (splicedDuration.length === 3)
      return (
        +splicedDuration[0] * 3600 +
        +splicedDuration[1] * 60 +
        +splicedDuration[2]
      );
    if (splicedDuration.length === 2)
      return +splicedDuration[0] * 60 + +splicedDuration[1];
    if (splicedDuration.length === 1) return +splicedDuration[0];
  }
}
