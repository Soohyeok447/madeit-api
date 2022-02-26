import { YoutubeProvider } from "../../domain/providers/YoutubeProvider";
import { VideoChartNotFoundException } from "./exceptions/VideoChartNotFoundException";
import { HttpClientImpl } from "./HttpClientImpl";

interface SearchParams {
  key: string,
  part: string,
  maxResults: number,
  pageToken: string,
  order: string,
  regionCode: string,
  type: string,
  q: string,
}

interface VideoParams {
  key: string,
  part: string,
  id: string
}

interface VideoResult {
  id: string,
  title: string,
  thumbnail: string,
  duration: number,
}

interface TotalResult {
  nextpageToken: string,
  items: VideoResult[] | [],
}

export class YoutubeProviderImpl implements YoutubeProvider {
  async searchByKeyword(keyword: string, maxResults: number, nextPageToken?: string,) {
    const youtubeApiUrl: string = 'https://www.googleapis.com/youtube/v3';
    const searchApiUrl: string = `${youtubeApiUrl}/search`;
    const videosApiUrl: string = `${youtubeApiUrl}/videos`;

    const HttpClient = new HttpClientImpl();

    const searchParams: SearchParams = this._mapToSearchparams(maxResults, nextPageToken, keyword)

    const searchResult = await this._callSearchApi(HttpClient, searchApiUrl, searchParams);

    const videosResult: VideoResult[] | [] = await Promise.all(searchResult.data.items.map(async e => {
      const videosParams: VideoParams = this._mapToVideosParams(e)

      const videosResult = await this._callVideosApi(HttpClient, videosApiUrl, videosParams);

      const replacedDuration: number = this._replaceDurationStringToNumber(videosResult);

      return this._mapResultToVideoResult(e, replacedDuration);
    }))

    const totalResult: TotalResult = this._mapToResultObj(searchResult, videosResult)

    return totalResult;
  }

  private async _callVideosApi(HttpClient: HttpClientImpl, videosApiUrl: string, videosParams: VideoParams) {
    try {
      return await HttpClient.get(videosApiUrl, null, videosParams);

    } catch (err) {
      throw new VideoChartNotFoundException();
    }
  }

  private async _callSearchApi(HttpClient: HttpClientImpl, searchApiUrl: string, searchParams: SearchParams) {
    try {
      return await HttpClient.get(searchApiUrl, null, searchParams);

    } catch (err) {
      throw new VideoChartNotFoundException();
    }
  }

  private _mapResultToVideoResult(e: any, durationParts: any) {
    return {
      id: e.id.videoId,
      title: e.snippet.title,
      thumbnail: e.snippet.thumbnails.high.url,
      duration: durationParts,
    };
  }

  private _mapToVideosParams(e: any) {
    return {
      key: process.env.GOOGLE_API_KEY,
      part: 'contentDetails',
      id: e.id.videoId
    };
  }

  private _mapToResultObj(searchResult, videosResult: any[]) {
    return {
      nextpageToken: searchResult.data.nextPageToken,
      items: videosResult,
    };
  }

  private _mapToSearchparams(maxResults: number, nextPageToken: string, keyword: string) {
    return {
      key: process.env.GOOGLE_API_KEY,
      part: 'snippet',
      maxResults,
      pageToken: nextPageToken,
      order: 'relevance',
      regionCode: 'KR',
      type: 'video',
      q: decodeURIComponent(keyword),
    };
  }

  private _replaceDurationStringToNumber(result) {
    const splicedDuration = result.data.items[0].contentDetails.duration
      .replace("PT", "")
      .replace("H", ":")
      .replace("M", ":")
      .replace("S", "")
      .split(":");

    if (splicedDuration.length === 3) return +splicedDuration[0] * 3600 + +splicedDuration[1] * 60 + +splicedDuration[2];
    if (splicedDuration.length === 2) return +splicedDuration[0] * 60 + +splicedDuration[1];
    if (splicedDuration.length === 1) return +splicedDuration[0];
  }
}