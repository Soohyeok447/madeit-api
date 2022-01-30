export class PutRoutineThumbnailObjectError extends Error {
  constructor() {
    super(`s3 bucket에 origin routine thumbnail 저장 실패`);
  }
}
