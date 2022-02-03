export class PutCardnewsObjectError extends Error {
  constructor() {
    super(`s3 bucket에 origin cardnews 저장 실패`);
  }
}
