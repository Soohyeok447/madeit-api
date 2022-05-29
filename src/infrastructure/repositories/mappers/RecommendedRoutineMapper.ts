import { RecommendedRoutine } from '../../../domain/entities/RecommendedRoutine';
import { CreateRecommendedRoutineDto } from '../../../domain/repositories/recommended-routine/dtos/CreateRecommendedRoutineDto';
import { UpdateRecommendedRoutineDto } from '../../../domain/repositories/recommended-routine/dtos/UpdateRecommendedRoutineDto';
import { RecommendedRoutineSchemaModel } from '../../schemas/models/RecommendedRoutineSchemaModel';

export class RecommendedRoutineMapper {
  public static mapCreateDtoToSchema(
    createDto: CreateRecommendedRoutineDto,
  ): RecommendedRoutineSchemaModel {
    return {
      title: createDto.title,
      introduction: createDto.introduction,
      hour: createDto.hour,
      minute: createDto.minute,
      days: createDto.days,
      alarm_video_id: createDto.alarmVideoId,
      content_video_id: createDto.contentVideoId,
      youtube_thumbnail: createDto.youtubeThumbnail,
      timer_duration: createDto.timerDuration,
      category: createDto.category,
      fixed_fields: createDto.fixedFields,
      exp: createDto.exp,
      point: createDto.point,
    };
  }

  public static mapUpdateDtoToSchema(
    updateDto: UpdateRecommendedRoutineDto,
  ): RecommendedRoutineSchemaModel {
    return {
      title: updateDto.title,
      introduction: updateDto.introduction,
      hour: updateDto.hour,
      minute: updateDto.minute,
      days: updateDto.days,
      alarm_video_id: updateDto.alarmVideoId,
      content_video_id: updateDto.contentVideoId,
      cardnews_id: updateDto.cardnewsId,
      thumbnail_id: updateDto.thumbnailId,
      youtube_thumbnail: updateDto.youtubeThumbnail,
      timer_duration: updateDto.timerDuration,
    };
  }

  public static mapSchemaToEntity(
    schemaModel: RecommendedRoutineSchemaModel,
  ): RecommendedRoutine {
    return new RecommendedRoutine(
      schemaModel._id.toString(),
      schemaModel.title,
      schemaModel.hour,
      schemaModel.minute,
      schemaModel.days,
      schemaModel.alarm_video_id,
      schemaModel.content_video_id,
      schemaModel.timer_duration,
      schemaModel.thumbnail_id ? schemaModel.thumbnail_id.toString() : null,
      schemaModel.youtube_thumbnail,
      schemaModel.cardnews_id ? schemaModel.cardnews_id.toString() : null,
      schemaModel.category,
      schemaModel.introduction,
      schemaModel.price,
      schemaModel.fixed_fields,
      schemaModel.point,
      schemaModel.exp,
      schemaModel.created_at,
      schemaModel.updated_at,
      schemaModel.deleted_at,
    );
  }
}
