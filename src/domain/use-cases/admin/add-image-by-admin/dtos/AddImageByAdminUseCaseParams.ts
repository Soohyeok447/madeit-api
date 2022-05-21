export class AddImageByAdminUseCaseParams {
  public readonly image: Express.Multer.File;

  public readonly description?: string;

  public readonly accessToken: string;
}
