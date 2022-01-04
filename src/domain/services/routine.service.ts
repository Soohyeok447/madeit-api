import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AddRoutineInput } from '../dto/routine/add_routine.input';
import { AddRoutineOutput } from '../dto/routine/add_routine.output';
import { BuyRoutineInput } from '../dto/routine/buy_routine.input';
import { GetAllRoutinesInput } from '../dto/routine/get_all_routines.input';
import { GetAllRoutinesOutput } from '../dto/routine/get_all_routines.output';
import { GetRoutineDetailInput } from '../dto/routine/get_routine_detail.input';
import { GetRoutineDetailOutput } from '../dto/routine/get_routine_detail.output';
import { InvalidTokenException } from '../exceptions/auth/invalid_token.exception';
import { InvalidRoutineIdException } from '../exceptions/routine/invalid_routine_id.exception';
import { RoutineNameConflictException } from '../exceptions/routine/routine_conflict.exception';
import { RoutineNotFoundException } from '../exceptions/routine/routine_not_found.exception';
import { UserNotAdminException } from '../exceptions/users/user_not_admin.exception';
import { Routine } from '../models/routine.model';
import { RoutineRepository } from '../repositories/routine.repsotiroy';
import { UserRepository } from '../repositories/users.repository';
import { RoutineService } from './interfaces/routine.service';

@Injectable()
export class RoutineServiceImpl implements RoutineService {
  constructor(
    private readonly routineRepository: RoutineRepository,
    private readonly userRepository: UserRepository,
  ) {}

  //TODO routine, schedule을 테스트하기 위해선 미리 routine이 있어야함
  public async addRoutine({
    userId,
    routine,
  }: AddRoutineInput): Promise<AddRoutineOutput> {
    //1. user가 admin인지 검사
    const user = await this.userRepository.findOne(userId);

    if (!user.isAdmin) {
      throw new UserNotAdminException();
    }

    //3. routine name 중복검사
    const result = await this.routineRepository.findOneByRoutineName(
      routine.name,
    );

    if (result) {
      throw new RoutineNameConflictException();
    }

    //4. routine add
    const newRoutineId = await this.routineRepository.create(routine);

    const output = {
      newRoutineId,
    };

    return output;
  }

  public async getAllRoutines({
    nextCursor,
  }: GetAllRoutinesInput): Promise<GetAllRoutinesOutput> {
    const routines = await this.routineRepository.findAll(nextCursor);

    const output = {
      ...routines,
    };

    return output;
  }

  public async getRoutineDetail({
    routineId,
  }: GetRoutineDetailInput): Promise<GetRoutineDetailOutput> {
    let routine: Routine;

    try {
      routine = await this.routineRepository.findOne(routineId);
    } catch (err) {
      throw new InvalidRoutineIdException();
    }

    if (!routine) {
      throw new RoutineNotFoundException();
    }

    return routine;
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
