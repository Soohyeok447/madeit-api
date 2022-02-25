import { SearchVideoByKeywordResponseDto } from "./search-video-by-keyword/dtos/SearchVideoByKeywordResponseDto"


export type SearchVideoByKeywordResponse = Promise<SearchVideoByKeywordResponseDto[] | []>