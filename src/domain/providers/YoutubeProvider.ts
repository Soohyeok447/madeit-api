export abstract class YoutubeProvider {
  abstract searchByKeyword(
    keyword: string,
    maxResults: number,
    nextPageToken?: string,
  );
}
