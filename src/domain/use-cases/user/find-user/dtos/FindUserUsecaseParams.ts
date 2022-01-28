import { Resolution } from 'src/domain/enums/Resolution';

export class FindUserUsecaseParams {
  id: string; // this is primary key in user table got from user decorator

  resolution: Resolution; // resolution for finding image
}
