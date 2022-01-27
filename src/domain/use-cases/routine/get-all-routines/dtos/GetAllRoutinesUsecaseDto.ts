import { Resolution } from 'src/domain/enums/Resolution';

export class GetAllRoutinesUsecaseDto {
  next?: string;

  size: number;

  resolution: Resolution;
}
