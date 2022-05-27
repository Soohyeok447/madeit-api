import { PointHistory } from '../../../domain/entities/PointHistory';
import { CreatePointHistoryDto } from '../../../domain/repositories/point-history/dtos/CreatePointHistoryDto';
import { PointHistorySchemaModel } from '../../schemas/models/PointHistorySchemaModel';

export class PointHistoryMapper {
  public static mapCreateDtoToSchema(createDto: CreatePointHistoryDto): {
    user_id: string;
    message: string;
    point: number;
  } {
    return {
      user_id: createDto.userId,
      message: createDto.message,
      point: createDto.point,
    };
  }

  public static mapSchemaToEntity(
    schemaModel: PointHistorySchemaModel,
  ): PointHistory {
    return new PointHistory(
      schemaModel._id.toString(),
      schemaModel.user_id.toString(),
      schemaModel.message,
      schemaModel.point,
      schemaModel.created_at,
      schemaModel.updated_at,
      schemaModel.deleted_at,
    );
  }
}
