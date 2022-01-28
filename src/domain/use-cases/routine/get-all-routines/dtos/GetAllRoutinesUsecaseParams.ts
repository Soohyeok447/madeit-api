import { Resolution } from 'src/domain/enums/Resolution';

export class GetAllRoutinesUsecaseParams {
  next?: string;

  size: number;

  resolution: Resolution;
}
