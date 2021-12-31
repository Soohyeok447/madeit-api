import { Test } from '@nestjs/testing';
import { UserRepository } from 'src/domain/repositories/users.repository';
import { RoutineService } from 'src/domain/services/interfaces/routine.service';
import { RoutineServiceImpl } from 'src/domain/services/routine.service';
import { CreateRoutineDto } from 'src/domain/repositories/dto/routine/create.dto';
import { RoutineType } from 'src/domain/models/enum/routine_type.enum';
import { RoutineRepository } from 'src/domain/repositories/routine.repsotiroy';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RoutineNotFoundException } from 'src/domain/exceptions/routine/routine_not_found.exception';
import { InvalidRoutineIdException } from 'src/domain/exceptions/routine/invalid_routine_id.exception';
import { InvalidTokenException } from 'src/domain/exceptions/auth/invalid_token.exception';
import { CartService } from 'src/domain/services/interfaces/cart.service';

const mockUserRepository = {
  findOne: jest.fn(),
  findOneByEmail: jest.fn(),
  findOneByUsername: jest.fn(),
  update: jest.fn(),
};

const mockRoutineRepository = {
  findOne: jest.fn(),
  findOneByRoutineName: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
}

const mockCartRepository = {
  findOne: jest.fn(),
  findOneByRoutineName: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
}

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: RoutineService,
          useClass: RoutineServiceImpl,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: RoutineRepository,
          useValue: mockRoutineRepository
        },
      ],
    }).compile();

    cartService = moduleRef.get<CartService>(CartService);
  });

  it('should be defined', async () => {
    expect(cartService).toBeDefined();
  });

  describe('addRoutinesToCart()', ()=>{

    expect('fix it');
  })
 

});
