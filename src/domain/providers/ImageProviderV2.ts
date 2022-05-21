export abstract class ImageProviderV2 {
  public abstract getImageUrl(id: string): Promise<string>;
}
