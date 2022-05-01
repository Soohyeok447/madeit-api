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
    recommendedRoutineSchemaModel: RecommendedRoutineSchemaModel,
  ): RecommendedRoutine {
    return new RecommendedRoutine(
      recommendedRoutineSchemaModel._id,
      recommendedRoutineSchemaModel.title,
      recommendedRoutineSchemaModel.hour,
      recommendedRoutineSchemaModel.minute,
      recommendedRoutineSchemaModel.days,
      recommendedRoutineSchemaModel.alarm_video_id,
      recommendedRoutineSchemaModel.content_video_id,
      recommendedRoutineSchemaModel.timer_duration,
      recommendedRoutineSchemaModel.thumbnail_id,
      recommendedRoutineSchemaModel.youtube_thumbnail,
      recommendedRoutineSchemaModel.cardnews_id,
      recommendedRoutineSchemaModel.category,
      recommendedRoutineSchemaModel.introduction,
      recommendedRoutineSchemaModel.price,
      recommendedRoutineSchemaModel.fixed_fields,
      recommendedRoutineSchemaModel.point,
      recommendedRoutineSchemaModel.exp,
    );
  }
}
