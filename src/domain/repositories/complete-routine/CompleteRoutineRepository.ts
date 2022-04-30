import { CompleteRoutine } from '../../entities/CompleteRoutine';

export abstract class CompleteRoutineRepository {
  public abstract findAll(): Promise<CompleteRoutine[]>;

  public abstract findAllByUserId(userId: string): Promise<CompleteRoutine[]>;

  public abstract save(dto: {
    userId: string;
    routineId: string;
  }): Promise<CompleteRoutine>;
}
