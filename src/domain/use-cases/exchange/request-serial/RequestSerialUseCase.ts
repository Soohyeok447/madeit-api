import { UseCase } from '../../UseCase';
import { RequestSerialResponseDto } from './dtos/RequestSerialResponseDto';
import { RequestSerialUsecaseParams } from './dtos/RequestSerialUsecaseParams';

export abstract class RequestSerialUseCase
  implements UseCase<RequestSerialUsecaseParams, RequestSerialResponseDto>
{
  public abstract execute({
    userId,
    email,
  }: RequestSerialUsecaseParams): Promise<RequestSerialResponseDto>;
}
