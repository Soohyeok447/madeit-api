import { Routine } from '../../../domain/entities/Routine';
import { CreateRoutineDto } from '../../../domain/repositories/routine/dtos/CreateRoutineDto';
import { UpdateRoutineDto } from '../../../domain/repositories/routine/dtos/UpdateRoutineDto';
import { RoutineSchemaModel } from '../../schemas/models/RoutineSchemaModel';

export class RoutineMapper {
  static mapCreateDtoToSchema(createDto: CreateRoutineDto): RoutineSchemaModel {
    return {
      user_id: createDto.userId,
      title: createDto.title,
      hour: createDto.hour,
      minute: createDto.minute,
      days: createDto.days,
      alarm_video_id: createDto.alarmVideoId,
      content_video_id: createDto.contentVideoId,
      timer_duration: createDto.timerDuration,
      fixed_fields: createDto.fixedFields,
      exp: createDto.exp,
      point: createDto.point,
    };
  }

  static mapUpdateDtoToSchema(updateDto: UpdateRoutineDto): RoutineSchemaModel {
    return {
      title: updateDto.title,
      hour: updateDto.hour,
      minute: updateDto.minute,
      days: updateDto.days,
      alarm_video_id: updateDto.alarmVideoId,
      content_video_id: updateDto.contentVideoId,
      timer_duration: updateDto.timerDuration,
      activation: updateDto.activation,
    };
  }

  static mapSchemaToEntity(routineSchemaModel: RoutineSchemaModel): Routine {
    return new Routine(
      routineSchemaModel._id,
      routineSchemaModel.title,
      routineSchemaModel.hour,
      routineSchemaModel.minute,
      routineSchemaModel.days,
      routineSchemaModel.alarm_video_id,
      routineSchemaModel.content_video_id,
      routineSchemaModel.timer_duration,
      routineSchemaModel.activation,
      routineSchemaModel.fixed_fields,
      routineSchemaModel.point,
      routineSchemaModel.exp,
    );
  }
}
