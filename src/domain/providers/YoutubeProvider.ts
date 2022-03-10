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
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
}

export abstract class YoutubeProvider {
  abstract searchByKeyword(
    keyword: string,
    maxResults: number,
  ): Promise<CallVideosApiResult[]>;
}
