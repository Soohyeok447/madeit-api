import { Cart } from '../../entities/Cart';
import { CreateCartDto } from './dtos/CreateCartDto';

export abstract class CartRepository {
  abstract create(dto: CreateCartDto): Promise<Cart>;

  // abstract update(id: string, data: UpdateCartDto): Promise<void>;

  abstract delete(cartId: string): Promise<void>;

  abstract findAll(userId: string): Promise<Cart[]>;

  abstract findOne(cartId: string): Promise<Cart | null>;

  abstract findOneByRoutineId(
    recommendedRoutineId: string,
  ): Promise<Cart | null>;
}
