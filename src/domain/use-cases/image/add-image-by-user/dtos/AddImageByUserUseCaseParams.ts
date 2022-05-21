export class AddImageByUserUseCaseParams {
  public readonly image: Express.Multer.File;

  public readonly description?: string;
}
