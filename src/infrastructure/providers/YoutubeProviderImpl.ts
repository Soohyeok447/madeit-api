import {
  CallVideosApiResult,
  SearchApiParams,
  VideoApiParams,
  YoutubeProvider,
} from '../../domain/providers/YoutubeProvider';
import { VideoChartNotFoundException } from './exceptions/VideoChartNotFoundException';
import { HttpClientImpl } from './HttpClientImpl';

export class YoutubeProviderImpl implements YoutubeProvider {
  async searchByKeyword(
    keyword: string,
    maxResults: number,
  ): Promise<CallVideosApiResult[] | []> {
    const youtubeApiUrl = 'https://www.googleapis.com/youtube/v3';
    const searchApiUrl = `${youtubeApiUrl}/search`;
    const videosApiUrl = `${youtubeApiUrl}/videos`;

    const HttpClient = new HttpClientImpl();

    const searchApiParams: SearchApiParams = this._mapToSearchparams(
      maxResults,
      keyword,
    );

    const callSearchApiResult = await this._callSearchApi(
      HttpClient,
      searchApiUrl,
      searchApiParams,
    );

    if (!callSearchApiResult.data.items.length) return [];

    const mappedCallVideosApiResult: CallVideosApiResult[] | [] =
      await Promise.all(
        callSearchApiResult.data.items.map(async (e) => {
          const videosApiParams: VideoApiParams = this._mapToVideosParams(e);

          const callVideosApiResult = await this._callVideosApi(
            HttpClient,
            videosApiUrl,
            videosApiParams,
          );

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
  ) {
    try {
      return await HttpClient.get(videosApiUrl, null, videosParams);
    } catch (err) {
      throw new VideoChartNotFoundException();
    }
  }

  private async _callSearchApi(
    HttpClient: HttpClientImpl,
    searchApiUrl: string,
    searchParams: SearchApiParams,
  ) {
    try {
      return await HttpClient.get(searchApiUrl, null, searchParams);
    } catch (err) {
      throw new VideoChartNotFoundException();
    }
  }

  private _mapCallVideosApiResult(e: any, durationParts: any) {
    return {
      videoId: e.id.videoId,
      title: decodeURI(e.snippet.title),
      thumbnail: e.snippet.thumbnails.high.url,
      channel: e.snippet.channelTitle,
      duration: durationParts,
    };
  }

  private _mapToVideosParams(e: any) {
    return {
      key: process.env.GOOGLE_API_KEY,
      part: 'contentDetails',
      id: e.id.videoId,
    };
  }

  // videoApi 호출 결과를 output 객체로 매핑
  private _mapToResultObj(videosResult: any[]) {
    return {
      items: videosResult,
    };
  }

  private _mapToSearchparams(maxResults: number, keyword: string) {
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

  private _convertDurationToSecond(result) {
    const splicedDuration = result.data.items[0].contentDetails.duration
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
