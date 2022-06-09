import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AnalyzeRoutinesUsageUseCase } from '../../../domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCase';
import { AnalyzeRoutinesUsageResponseDto } from '../../../domain/use-cases/admin/analyze-routines-usage/dtos/AnalyzeRoutinesUsageResponseDto';
import { CountUsersAddedOneRoutineUseCase } from '../../../domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { CountUsersAddedOneRoutineResponseDto } from '../../../domain/use-cases/admin/count-users-added-one-routine/dtos/CountUsersAddedOneRoutineResponseDto';
import { CountUsersUseCase } from '../../../domain/use-cases/admin/count-users/CountUsersUseCase';
import { CountUsersResponseDto } from '../../../domain/use-cases/admin/count-users/dtos/CountUsersResponseDto';

@Injectable()
export class AdminAnalyzeController {
  public constructor(
    private readonly countActiveUsersUseCase: CountUsersUseCase,
    private readonly countUsersAddedOneRoutineUseCase: CountUsersAddedOneRoutineUseCase,
    private readonly analyzeRoutinesUsageUseCase: AnalyzeRoutinesUsageUseCase,
  ) {}

  public async countUsers(req: Request): Promise<CountUsersResponseDto> {
    return await this.countActiveUsersUseCase.execute({
      accessToken: req.cookies['accessToken'],
    });
  }

  public async countUsersAddedOneRoutine(
    req: Request,
  ): Promise<CountUsersAddedOneRoutineResponseDto> {
    return await this.countUsersAddedOneRoutineUseCase.execute({
      accessToken: req.cookies['accessToken'],
    });
  }

  public async analyzeRoutinesUsage(
    req: Request,
  ): Promise<AnalyzeRoutinesUsageResponseDto[]> {
    return await this.analyzeRoutinesUsageUseCase.execute({
      accessToken: req.cookies['accessToken'],
    });
  }
}
