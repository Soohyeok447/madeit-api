import { HtmlEntitiesProvider } from '../../domain/providers/HtmlEntitiesProvider';
import * as he from 'he';

export class HtmlEntitiesProviderImpl implements HtmlEntitiesProvider {
  decodeHtmlEntities(query: string): string {
    return he.decode(query);
  }
}
