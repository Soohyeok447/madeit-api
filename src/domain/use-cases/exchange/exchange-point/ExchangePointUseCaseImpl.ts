import { Injectable } from '@nestjs/common';
import { HttpException } from 'src/domain/common/exceptions/HttpException';
import { ExchangeToken } from 'src/domain/entities/ExchangeToken';
import { User } from 'src/domain/entities/User';
import { ExchangeAuthProvider } from 'src/domain/providers/ExchangeAuthProvider';
import { LoggerProvider } from 'src/domain/providers/LoggerProvider';
import { ExchangeOrderRepository } from 'src/domain/repositories/exchange-order/ExchangeOrderRepository';
import { ExchangeTokenRepository } from 'src/domain/repositories/exchange-token/ExchangeTokenRepository';
import { UserRepository } from 'src/domain/repositories/user/UserRepository';
import { ExchangePointResponseDto } from './dtos/ExchangePointResponseDto';
import { ExchangePointUseCaseParams } from './dtos/ExchangePointUseCaseParams';
import { ExchangePointUseCase } from './ExchangePointUseCase';

@Injectable()
export class ExchangePointUseCaseImpl implements ExchangePointUseCase {
  public constructor(
    private readonly exchangeAuthProvider: ExchangeAuthProvider,
    private readonly exchangeTokenRepository: ExchangeTokenRepository,
    private readonly exchangeOrderRepository: ExchangeOrderRepository,
    private readonly userRepositroy: UserRepository,
    private readonly loggerProvider: LoggerProvider,
  ) {}

  public async execute({
    userId,
    exchangeToken,
    bank,
    account,
    amount,
  }: ExchangePointUseCaseParams): Promise<ExchangePointResponseDto> {
    const entity: ExchangeToken | null =
      await this.exchangeTokenRepository.findOneByUserId(userId);

    if (!entity) {
      throw new HttpException(
        '이메일 인증을 먼저 진행해 주세요.',
        1,
        404,
        this.loggerProvider.getContext(),
        '이메일 인증을 건너뛰고 포인트 환전을 시도.',
      );
    }

    if (exchangeToken !== entity.token) {
      throw new HttpException(
        '권한이 없습니다.',
        2,
        403,
        this.loggerProvider.getContext(),
        '다른 이용자의 인증 정보 탈취 시도.',
      );
    }

    const isVerified: boolean = await this.exchangeAuthProvider.verify(
      exchangeToken,
    );

    if (!isVerified) {
      throw new HttpException(
        '만료된 인증정보입니다.',
        3,
        401,
        this.loggerProvider.getContext(),
        '너무 늦게 포인트 환전을 시도.',
      );
    }

    const user: User | null = await this.userRepositroy.findOne(userId);

    if (!user) {
      throw new HttpException(
        '이용자를 찾지 못했습니다.',
        4,
        404,
        this.loggerProvider.getContext(),
        '포인트 환전 중 이용자를 찾지 못함.',
      );
    }

    if (amount > user.point) {
      throw new HttpException(
        '포인트가 부족합니다.',
        5,
        404,
        this.loggerProvider.getContext(),
        '현재 보유한 포인트보다 많은 양으로 교환 시도.',
      );
    }

    await this.userRepositroy.update(userId, {
      point: user.point - amount,
    });

    await this.exchangeOrderRepository.save({
      userId,
      amount,
      bank,
      account,
    });

    return {};
  }
}
