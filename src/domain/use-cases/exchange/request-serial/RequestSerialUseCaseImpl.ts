import { Injectable } from '@nestjs/common';
import { EmailProvider } from 'src/domain/providers/EmailProvider';
import { SerialRepository } from 'src/domain/repositories/serial/SerialRepository';
import { RequestSerialResponseDto } from './dtos/RequestSerialResponseDto';
import { RequestSerialUsecaseParams } from './dtos/RequestSerialUsecaseParams';
import { RequestSerialUseCase } from './RequestSerialUseCase';

@Injectable()
export class RequestSerialUseCaseImpl implements RequestSerialUseCase {
  public constructor(
    private readonly emailProvider: EmailProvider,
    private readonly serialRepository: SerialRepository,
  ) {}

  public async execute({
    userId,
    email,
  }: RequestSerialUsecaseParams): Promise<RequestSerialResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const subject: string = `Madeit 포인트 환급을 위한 인증번호 안내`;

    const serial: string = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4);

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const message: string = `Madeit 포인트 환급을 위한 인증번호는 ${serial}입니다.`;

    await this.emailProvider.send(email, subject, message);

    await this.serialRepository.save(userId, email, serial);

    // TODO: Prepare your own background job scheduler.
    setTimeout(
      () => this.serialRepository.deleteOneByUserId(userId),
      1000 * 60 * 30,
    );

    return new RequestSerialResponseDto();
  }
}
