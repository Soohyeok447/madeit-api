import { HttpResponse } from '../../domain/providers/HttpClient';
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
      if (err.code === 'ECONNRESET') throw new SocketHangUpException();

      if (
        err.response.data.error.code === 403 &&
        err.response.data.error.errors[0].reason === 'quotaExceeded'
      )
        throw new QuotaExceededException();
      if (
        err.response.data.error.code === 403 &&
        err.response.data.error.errors[0].reason === 'forbidden'
      )
        throw new YoutubeForbiddenException();
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
      if (err.code === 'ECONNRESET') throw new SocketHangUpException();
      if (
        err.response.data.error.code === 403 &&
        err.response.data.error.errors[0].reason === 'quotaExceeded'
      )
        throw new QuotaExceededException();
      if (
        err.response.data.error.code === 403 &&
        err.response.data.error.errors[0].reason === 'forbidden'
      )
        throw new YoutubeForbiddenException();
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
      key: process.env.GOOGLE_API_KEY,
      part: 'contentDetails',
      id: e.id.videoId,
    };
  }

  private _mapToSearchparams(
    maxResults: number,
    keyword: string,
  ): SearchApiParams {
    return {
      key: process.env.GOOGLE_API_KEY,
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
