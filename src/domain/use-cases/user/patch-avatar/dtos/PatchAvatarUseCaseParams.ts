export class PatchAvatarUseCaseParams {
  public readonly id: string;

  public readonly avatar?: Express.Multer.File;
}
