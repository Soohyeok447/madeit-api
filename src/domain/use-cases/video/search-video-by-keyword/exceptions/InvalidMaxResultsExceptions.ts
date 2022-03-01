import { BadRequestException } from '../../../../common/exceptions/BadRequestException';

export class InvalidMaxResultsExceptions extends BadRequestException {
  constructor(maxResults: number) {
    super(`유효하지 않은 최대 검색 수 ${maxResults}`, 1);
  }
}
