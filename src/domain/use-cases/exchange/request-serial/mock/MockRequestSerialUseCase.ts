import { Injectable } from '@nestjs/common';
import { SerialRepository } from 'src/domain/repositories/serial/SerialRepository';
import { LoggerProvider } from '../../../../providers/LoggerProvider';
import { RequestSerialResponseDto } from './../dtos/RequestSerialResponseDto';
import { RequestSerialUsecaseParams } from './../dtos/RequestSerialUsecaseParams';
import { RequestSerialUseCase } from './../RequestSerialUseCase';

@Injectable()
export class MockRequestSerialUseCaseImpl implements RequestSerialUseCase {
  public constructor(
    private readonly serialRepository: SerialRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    userId,
    email,
  }: RequestSerialUsecaseParams): Promise<RequestSerialResponseDto> {
    this._logger.setContext('MockRequestSerial');

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const serial: string = '1111';

    await this.serialRepository.save(userId, email, serial);

    return new RequestSerialResponseDto();
  }
}
