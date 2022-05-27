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
      schemaModel._id.toString(),
      schemaModel.user_id.toString(),
      schemaModel.routine_id.toString(),
      schemaModel.created_at,
      schemaModel.updated_at,
      schemaModel.deleted_at,
    );
  }
}
