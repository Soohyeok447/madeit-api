import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AddRoutineInput } from '../use-cases/add-routine/dtos/add_routine.input';
import { RoutineNameConflictException } from '../use-cases/add-routine/exceptions/routine_conflict.exception';
import { RoutineNotFoundException } from '../../common/exceptions/routine_not_found.exception';
import { UserNotAdminException } from '../use-cases/add-routine/exceptions/user_not_admin.exception';
import { Routine } from '../routine.model';
import { RoutineRepository } from '../routine.repsotiroy';
import { UserRepository } from '../../users/users.repository';
import { RoutineService } from './interface/routine.service';
import { AddRoutineOutput } from '../use-cases/add-routine/dtos/add_routine.output';
import { GetAllRoutinesInput } from '../use-cases/get-all-routines/dtos/get_all_routines.input';
import { GetAllRoutinesOutput } from '../use-cases/get-all-routines/dtos/get_all_routines.output';
import { GetRoutineDetailInput } from '../use-cases/get-routine-detail/dtos/get_routine_detail.input';
import { GetRoutineDetailOutput } from '../use-cases/get-routine-detail/dtos/get_routine_detail.output';
import { InvalidRoutineIdException } from '../use-cases/get-routine-detail/exceptions/invalid_routine_id.exception';
import { BuyRoutineInput } from '../use-cases/buy-routine/dtos/buy_routine.input';

@Injectable()
export class RoutineServiceImpl implements RoutineService {
  constructor(
    private readonly routineRepository: RoutineRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async addRoutine({
    userId,
    routine,
  }: AddRoutineInput): Promise<AddRoutineOutput> {
    //user가 admin인지 검사
    const user = await this.userRepository.findOne(userId);

    if (!user.isAdmin) {
      throw new UserNotAdminException();
    }

    //routine name 중복검사
    const result = await this.routineRepository.findOneByRoutineName(
      routine.name,
    );

    if (result) {
      throw new RoutineNameConflictException();
    }

    //add routine
    const newRoutineId = await this.routineRepository.create(routine);

    const output = {
      newRoutineId,
    };

    return output;
  }

  public async getAllRoutines({
    next,
    size,
  }: GetAllRoutinesInput): Promise<GetAllRoutinesOutput> {
    const routines = await this.routineRepository.findAll(size, next);

    //단 하나의 루틴도 못찾았을 때
    //nextCursor가 마지막 index 였을 때
    if (routines.length == 0 || !routines) {
      return {
        data: null,
        paging: {
          hasMore: false,
          nextCursor: null,
        },
      };
    }

    const hasMore = routines.length < size ? false : true;

    const nextCursor = hasMore ? routines[routines.length - 1]['_id'] : null;

    const mappedResult: Routine[] = routines.map((routine) => {
      const {
        thumbnail_url: _,
        introduction_script: __,
        introduction_image_url: ___,
        related_products: ____,
        _id: _____,
        ...others
      }: any = routine;

      return {
        id: routine['_id'],
        thumbnailUrl: routine['thumbnail_url'],
        introductionScript: routine['introduction_script'],
        introductionImageUrl: routine['introduction_image_url'],
        relatedProducts: routine['related_products'],
        ...others,
      };
    });

    return {
      data: mappedResult,
      paging: {
        hasMore,
        nextCursor,
      },
    };    
  }

  public async getRoutineDetail({
    routineId,
  }: GetRoutineDetailInput): Promise<GetRoutineDetailOutput> {
    let routine: Routine;

    try {
      routine = await this.routineRepository.findOne(routineId);

      if (!routine) {
        throw new RoutineNotFoundException();
      }

      const {
        thumbnail_url: _,
        introduction_script: __,
        introduction_image_url: ___,
        related_products: ____,
        _id: _____,
        ...others
      }: any = routine;
  
      const newRoutine: Routine = {
        id: routine['_id'],
        thumbnailUrl: routine['thumbnail_url'],
        introductionImageUrl: routine['introduction_image_url'],
        introductionScript: routine['introduction_script'],
        relatedProducts: routine['related_products'],
        ...others,
      };
  
      return newRoutine;
    } catch (err) {
      
      throw new InvalidRoutineIdException();
    }

  }

  /**
     * 유저가 상세페이지 구경 중 -> 구매 버튼을 누름 -> 스케줄을 짜고 확정(저장) 
-> 0원 or XXXXX원 결제 (0원일 경우 유저에게는 결제 과정은 생략)
     */
  public async buyRoutine({
    userId,
    routineId,
  }: BuyRoutineInput): Promise<void> {
    //TODO 유료인 경우
    //TODO 무료인 경우

    return;
  }
}
