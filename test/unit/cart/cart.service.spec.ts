import { Test } from '@nestjs/testing';
import { UserRepository } from '../../../src/domain/users/users.repository';
import { CartService } from '../../../src/domain/cart/service/interface/cart.service';
import { AddRoutineToCartInput } from 'src/domain/cart/use-cases/add-routine-to-cart/dtos/add_routines_to_cart.input';
import { UserNotFoundException } from 'src/domain/common/exceptions/user_not_found.exception';
import { WrongCartRequestException } from 'src/domain/cart/common/exceptions/wrong_cart_request.exception';
import { CartServiceImpl } from 'src/domain/cart/service/cart.service';
import { GetCartInput } from 'src/domain/cart/use-cases/get-cart/dtos/get_cart.input';
import { DeleteRoutineFromCartInput } from 'src/domain/cart/use-cases/delete-routine-from-cart/dtos/delete_routines_from_cart.input';

const mockUserRepository = {
  findCartById: jest.fn(),
  updateCart: jest.fn(),
};

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: CartService,
          useClass: CartServiceImpl,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    cartService = moduleRef.get<CartService>(CartService);
  });

  it('should be defined', async () => {
    expect(cartService).toBeDefined();
  });

  describe('addRoutineToCart()', () => {
    const input: AddRoutineToCartInput = {
      userId: 'id',
      routineId: 'routineId',
    };

    it('should return nothing', async () => {
      mockUserRepository.updateCart.mockResolvedValue(null);

      expect(cartService.addRoutineToCart(input)).resolves;
    });

    it('should throw UserNotFoundException', async () => {
      mockUserRepository.updateCart.mockRejectedValue('userNotFound');

      expect(cartService.addRoutineToCart(input)).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('should throw WrongCartRequestException', async () => {
      mockUserRepository.updateCart.mockRejectedValue('conflict');

      expect(cartService.addRoutineToCart(input)).rejects.toThrow(
        WrongCartRequestException,
      );
    });
  });

  describe('getCart()', () => {
    const input: GetCartInput = {
      userId: 'id',
    };

    it('should return cart', async () => {
      mockUserRepository.findCartById.mockResolvedValue({
        shopping_cart: 'cart',
      });

      expect(cartService.getCart(input)).resolves.toBeDefined();
    });
  });

  describe('deleteRoutineFromCart()', () => {
    const input: DeleteRoutineFromCartInput = {
      userId: 'id',
      routineId: 'routineId',
    };

    it('should return nothing', async () => {
      mockUserRepository.updateCart.mockResolvedValue(null);

      expect(cartService.deleteRoutineFromCart(input)).resolves;
    });

    it('should throw UserNotFoundException', async () => {
      mockUserRepository.updateCart.mockRejectedValue('userNotFound');

      expect(cartService.deleteRoutineFromCart(input)).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('should throw WrongCartRequestException', async () => {
      mockUserRepository.updateCart.mockRejectedValue('noRoutineInCart');

      expect(cartService.deleteRoutineFromCart(input)).rejects.toThrow(
        WrongCartRequestException,
      );
    });
  });
});
