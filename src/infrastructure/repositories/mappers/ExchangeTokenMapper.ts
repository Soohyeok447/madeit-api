import { ExchangeToken } from '../../../domain/entities/ExchangeToken';
import { CreateExchangeTokenDto } from '../../../domain/repositories/exchange-token/dtos/CreateExchangeTokenDto';
import { UpdateExchangeTokenDto } from '../../../domain/repositories/exchange-token/dtos/UpdateExchangeToken';
import { ExchangeTokenSchemaModel } from '../../schemas/models/ExchangeTokenSchemaModel';

export class ExchangeTokenMapper {
  public static mapCreateDtoToSchema(createDto: CreateExchangeTokenDto): {
    user_id: string;
    token: string;
  } {
    return {
      user_id: createDto.userId,
      token: createDto.token,
    };
  }

  public static mapUpdateDtoToSchema(
    updateDto: UpdateExchangeTokenDto,
  ): ExchangeTokenSchemaModel {
    return {
      token: updateDto.token,
    };
  }

  public static mapSchemaToEntity(
    schemaModel: ExchangeTokenSchemaModel,
  ): ExchangeToken {
    return new ExchangeToken(
      schemaModel._id,
      schemaModel.user_id,
      schemaModel.token,
      schemaModel.created_at,
      schemaModel.updated_at,
      schemaModel.deleted_at,
    );
  }
}
