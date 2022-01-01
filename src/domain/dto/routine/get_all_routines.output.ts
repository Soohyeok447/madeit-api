import { Routine } from 'src/domain/models/routine.model';

export class GetAllRoutinesOutput {
  data: Routine[];

  paging: {
    hasMore: boolean;
    nextCursor: string;
  };
}
