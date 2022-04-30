import { CompleteRoutine } from '../../../domain/entities/CompleteRoutine';
import { CreateCompleteRoutineDto } from '../../../domain/repositories/complete-routine/dtos/CreateCompleteRoutineRepository';
import { CompleteRoutineSchemaModel } from '../../schemas/models/CompleteRoutineSchemaModel';

export class CompleteRoutineMapper {
  public static mapCreateDtoToSchema(createDto: CreateCompleteRoutineDto): {
    user_id: string;
    routine_id: string;
  } {
    return {
      user_id: createDto.userId,
      routine_id: createDto.routineId,
    };
  }

  public static mapSchemaToEntity(
    schemaModel: CompleteRoutineSchemaModel,
  ): CompleteRoutine {
    return new CompleteRoutine(
      schemaModel._id,
      schemaModel.user_id,
      schemaModel.routine_id,
      schemaModel.created_at,
    );
  }
}
