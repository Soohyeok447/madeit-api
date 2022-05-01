import { Cart } from '../../../domain/entities/Cart';
import { CreateCartDto } from '../../../domain/repositories/cart/dtos/CreateCartDto';
import { CartSchemaModel } from '../../schemas/models/CartSchemaModel';

export class CartMapper {
  public static mapCreateDtoToSchema(createDto: CreateCartDto): {
    user_id: string;
    recommended_routine_id: string;
  } {
    return {
      user_id: createDto.userId,
      recommended_routine_id: createDto.recommendedRoutineId,
    };
  }

  public static mapSchemaToEntity(schemaModel: CartSchemaModel): Cart {
    return new Cart(
      schemaModel._id,
      schemaModel.user_id,
      schemaModel.recommended_routine_id,
      schemaModel.created_at,
      schemaModel.updated_at,
      schemaModel.deleted_at,
    );
  }
}
