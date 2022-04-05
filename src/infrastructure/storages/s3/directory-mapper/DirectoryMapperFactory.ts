import { DirectoryMapper } from './DirectoryMapper';

export abstract class DirectoryMapperFactory {
  public abstract create(type: string, title?: string): DirectoryMapper;
}
