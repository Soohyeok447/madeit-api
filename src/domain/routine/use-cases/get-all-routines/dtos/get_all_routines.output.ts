import { Routine } from 'src/domain/routine/routine.model';

export class GetAllRoutinesOutput {
  data: Routine[];

  paging: {
    hasMore: boolean;
    nextCursor: string;
  };
}
