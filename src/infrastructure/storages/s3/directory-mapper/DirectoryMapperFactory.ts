import { DirectoryMapper } from './DirectoryMapper';

export abstract class DirectoryMapperFactory {
  abstract create(type: string, title?: string): DirectoryMapper;
}
