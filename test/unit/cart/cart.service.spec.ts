import { Test } from '@nestjs/testing';
import { UserRepository } from '../../../src/domain/common/repository/user/users.repository';
import { CartService } from '../../../src/domain/cart/service/interface/cart.service';
import { AddRoutineToCartInput } from 'src/domain/cart/use-cases/add-routine-to-cart/dtos/add_routines_to_cart.input';
import { UserNotFoundException } from 'src/domain/common/exception/user_not_found.exception';
import { WrongCartRequestException } from 'src/domain/cart/common/exceptions/wrong_cart_request.exception';
import { CartServiceImpl } from 'src/domain/cart/service/cart.service';
import { GetCartsInput } from 'src/domain/cart/use-cases/get-carts/dtos/get_carts.input';
import { DeleteRoutineFromCartInput } from 'src/domain/cart/use-cases/delete-routine-from-cart/dtos/delete_routines_from_cart.input';
import { CartRepository } from 'src/domain/common/repository/cart/cart.repository';
import { RoutineRepository } from 'src/domain/common/repository/routine/routine.repsotiroy';
import { RoutineNotFoundException } from 'src/domain/common/exception/routine_not_found.exception';
import { CartConflictException } from 'src/domain/cart/use-cases/add-routine-to-cart/exceptions/cart_conflict.exception';
import { CartNotFoundException } from 'src/domain/cart/common/exceptions/cart_not_found.exception';

const mockCartRepository = {
  findOne: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

const mockRoutineRepository = {
  findOne: jest.fn(),
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
          provide: CartRepository,
          useValue: mockCartRepository,
        },
        {
          provide: RoutineRepository,
          useValue: mockRoutineRepository,
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
      routineId: '123456789012345678901234',
    };

    it('should throw RoutineNotFoundException', async () => {
      mockRoutineRepository.findOne.mockResolvedValue(undefined);

      expect(cartService.addRoutineToCart(input)).rejects.toThrow(
        RoutineNotFoundException,
      );
    });

    it('should throw UserNotFoundException', async () => {
      mockRoutineRepository.findOne.mockResolvedValue('an user');
      mockCartRepository.findAll.mockResolvedValue([
        {
          routine_id: {
            _id: 'asdf',
          },
        },
        {
          routine_id: {
            _id: 'asdf',
          },
        },
        {
          routine_id: {
            _id: '123456789012345678901234',
          },
        },
      ]);

      expect(cartService.addRoutineToCart(input)).rejects.toThrow(
        CartConflictException,
      );
    });

    it('should throw WrongCartRequestException', async () => {
      mockRoutineRepository.findOne.mockResolvedValue('an user');
      mockCartRepository.findAll.mockResolvedValue([
        {
          routine_id: {
            _id: 'asdf',
          },
        },
        {
          routine_id: {
            _id: 'asdf',
          },
        },
        {
          routine_id: {
            _id: 'asdf',
          },
        },
      ]);
      mockCartRepository.create.mockResolvedValue(null);

      expect(await cartService.addRoutineToCart(input));
    });
  });

  describe('getCarts()', () => {
    const input: GetCartsInput = {
      userId: 'id',
    };

    it('should throw CartNotFoundException', async () => {
      mockCartRepository.findAll.mockResolvedValue(undefined);

      expect(cartService.getCarts(input)).rejects.toThrow(
        CartNotFoundException,
      );
    });
  });

  describe('deleteRoutineFromCart()', () => {
    const input: DeleteRoutineFromCartInput = {
      cartId: 'asdf',
    };

    it('should return CartNotFoundException', async () => {
      mockCartRepository.findOne.mockResolvedValue(null);

      expect(cartService.deleteRoutineFromCart(input)).rejects.toThrow(
        CartNotFoundException,
      );
    });

    it('should return nothing', async () => {
      mockCartRepository.findOne.mockResolvedValue('an cart');
      mockCartRepository.delete.mockResolvedValue(null);

      expect(await cartService.deleteRoutineFromCart(input));
    });
  });
});
