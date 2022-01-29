export class PutProfileImageObjectError extends Error {
  constructor() {
    super(`s3 bucket에 origin profile image 저장 실패`);
  }
}
