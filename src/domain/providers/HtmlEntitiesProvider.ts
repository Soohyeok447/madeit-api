export abstract class HtmlEntitiesProvider {
  public abstract decodeHtmlEntities(query: string): string;
}
