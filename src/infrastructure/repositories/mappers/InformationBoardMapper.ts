import { InformationBoard } from '../../../domain/entities/InformationBoard';
import { CreateBoardDto } from '../../../domain/repositories/information-board/dtos/createBoardDto';
import { UpdateBoardDto } from '../../../domain/repositories/information-board/dtos/updateBoardDto';
import { InformationBoardSchemaModel } from '../../schemas/models/InformationBoardSchemaModel';

export class InformationBoardMapper {
  static mapCreateDtoToSchema(
    createDto: CreateBoardDto,
  ): InformationBoardSchemaModel {
    return {
      title: createDto.title,
    };
  }

  static mapUpdateDtoToSchema(
    updateDto: UpdateBoardDto,
  ): InformationBoardSchemaModel {
    return {
      title: updateDto.title,
    };
  }

  static mapSchemaToEntity(
    schema: InformationBoardSchemaModel,
  ): InformationBoard {
    return new InformationBoard(
      schema._id,
      schema.title,
      schema.views,
      schema.cardnews_id,
    );
  }
}
