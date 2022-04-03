import { Cart } from '../../entities/Cart';
import { CreateCartDto } from './dtos/CreateCartDto';

export abstract class CartRepository {
  public abstract create(dto: CreateCartDto): Promise<Cart>;

  // abstract update(id: string, data: UpdateCartDto): Promise<void>;

  public abstract delete(cartId: string): Promise<void>;

  public abstract findAll(userId: string): Promise<Cart[]>;

  public abstract findOne(cartId: string): Promise<Cart | null>;

  public abstract findOneByRoutineId(
    recommendedRoutineId: string,
  ): Promise<Cart | null>;
}
