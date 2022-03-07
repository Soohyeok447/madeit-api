export abstract class HtmlEntitiesProvider {
  abstract decodeHtmlEntities(query: string): string;
}
