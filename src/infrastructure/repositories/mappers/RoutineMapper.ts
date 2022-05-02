import { Routine } from '../../../domain/entities/Routine';
import { CreateRoutineDto } from '../../../domain/repositories/routine/dtos/CreateRoutineDto';
import { UpdateRoutineDto } from '../../../domain/repositories/routine/dtos/UpdateRoutineDto';
import { RoutineSchemaModel } from '../../schemas/models/RoutineSchemaModel';

export class RoutineMapper {
  public static mapCreateDtoToSchema(
    createDto: CreateRoutineDto,
  ): RoutineSchemaModel {
    return {
      user_id: createDto.userId,
      title: createDto.title,
      hour: createDto.hour,
      minute: createDto.minute,
      days: createDto.days,
      alarm_video_id: createDto.alarmVideoId,
      alarm_type: createDto.alarmType,
      content_video_id: createDto.contentVideoId,
      timer_duration: createDto.timerDuration,
      fixed_fields: createDto.fixedFields,
      exp: createDto.exp,
      point: createDto.point,
      recommended_routine_id: createDto.recommendedRoutineId,
    };
  }

  public static mapUpdateDtoToSchema(
    updateDto: UpdateRoutineDto,
  ): RoutineSchemaModel {
    return {
      title: updateDto.title,
      hour: updateDto.hour,
      minute: updateDto.minute,
      days: updateDto.days,
      alarm_video_id: updateDto.alarmVideoId,
      alarm_type: updateDto.alarmType,
      content_video_id: updateDto.contentVideoId,
      timer_duration: updateDto.timerDuration,
      activation: updateDto.activation,
    };
  }

  public static mapSchemaToEntity(schemaModel: RoutineSchemaModel): Routine {
    return new Routine(
      schemaModel._id,
      schemaModel.title,
      schemaModel.hour,
      schemaModel.minute,
      schemaModel.days,
      schemaModel.alarm_video_id,
      schemaModel.alarm_type,
      schemaModel.content_video_id,
      schemaModel.timer_duration,
      schemaModel.activation,
      schemaModel.fixed_fields,
      schemaModel.point,
      schemaModel.exp,
      schemaModel.recommended_routine_id,
      schemaModel.created_at,
      schemaModel.updated_at,
      schemaModel.deleted_at,
    );
  }
}
