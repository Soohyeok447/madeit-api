import { ExchangeOrder } from '../../../domain/entities/ExchangeOrder';
import { CreateExchangeOrderDto } from '../../../domain/repositories/exchange-order/dtos/CreateExchangeOrderDto';
import { UpdateExchangeOrderDto } from '../../../domain/repositories/exchange-order/dtos/UpdateExchangeOrderDto';
import { ExchangeOrderSchemaModel } from '../../schemas/models/ExchangeOrderSchemaModel';

export class ExchangeOrderMapper {
  public static mapCreateDtoToSchema(createDto: CreateExchangeOrderDto): {
    user_id: string;
    amount: number;
    bank: string;
    account: string;
  } {
    return {
      user_id: createDto.userId,
      amount: createDto.amount,
      bank: createDto.bank,
      account: createDto.account,
    };
  }

  public static mapUpdateDtoToSchema(
    updateDto: UpdateExchangeOrderDto,
  ): ExchangeOrderSchemaModel {
    return {
      state: updateDto.state,
    };
  }

  public static mapSchemaToEntity(
    schemaModel: ExchangeOrderSchemaModel,
  ): ExchangeOrder {
    return new ExchangeOrder(
      schemaModel._id,
      schemaModel.user_id,
      schemaModel.amount,
      schemaModel.bank,
      schemaModel.account,
      schemaModel.state,
    );
  }
}
