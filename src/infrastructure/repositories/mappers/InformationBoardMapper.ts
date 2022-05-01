import { InformationBoard } from '../../../domain/entities/InformationBoard';
import { CreateBoardDto } from '../../../domain/repositories/information-board/dtos/CreateBoardDto';
import { UpdateBoardDto } from '../../../domain/repositories/information-board/dtos/UpdateBoardDto';
import { InformationBoardSchemaModel } from '../../schemas/models/InformationBoardSchemaModel';

export class InformationBoardMapper {
  public static mapCreateDtoToSchema(
    createDto: CreateBoardDto,
  ): InformationBoardSchemaModel {
    return {
      title: createDto.title,
    };
  }

  public static mapUpdateDtoToSchema(
    updateDto: UpdateBoardDto,
  ): InformationBoardSchemaModel {
    return {
      title: updateDto.title,
      views: updateDto.views,
      cardnews_id: updateDto.cardnewsId,
    };
  }

  public static mapSchemaToEntity(
    schemaModel: InformationBoardSchemaModel,
  ): InformationBoard {
    return new InformationBoard(
      schemaModel._id,
      schemaModel.title,
      schemaModel.views,
      schemaModel.cardnews_id,
      schemaModel.created_at,
      schemaModel.updated_at,
      schemaModel.deleted_at,
    );
  }
}
