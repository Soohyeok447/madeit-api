import { Cart } from '../../../domain/entities/Cart';
import { CreateCartDto } from '../../../domain/repositories/cart/dtos/CreateCartDto';
import { CartSchemaModel } from '../../schemas/models/CartSchemaModel';

export class CartMapper {
  static mapCreateDtoToSchema(createDto: CreateCartDto) {
    return {
      user_id: createDto.userId,
      recommended_routine_id: createDto.recommendedRoutineId,
    };
  }

  static mapSchemaToEntity(schemaModel: CartSchemaModel) {
    return new Cart(
      schemaModel._id,
      schemaModel.user_id,
      schemaModel.recommended_routine_id,
    );
  }
}
