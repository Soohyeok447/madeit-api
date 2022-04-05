export interface SearchApiParams {
  key: string;
  part: string;
  maxResults: number;
  order: string;
  regionCode: string;
  type: string;
  q: string;
}

export interface VideoApiParams {
  key: string;
  part: string;
  id: string;
}

export interface CallVideosApiResult {
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: number;
}

export abstract class YoutubeProvider {
  public abstract searchByKeyword(
    keyword: string,
    maxResults: number,
  ): Promise<CallVideosApiResult[]>;
}
