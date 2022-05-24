/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { LoggerProvider } from 'src/domain/providers/LoggerProvider';
import { ImageRepositoryV2 } from '../../../../repositories/imageV2/ImageRepositoryV2';
import { AddImageByAdminUseCase } from '../AddImageByAdminUseCase';
import { AddImageByAdminResponseDto } from '../dtos/AddImageByAdminResponseDto';
import { AddImageByAdminUseCaseParams } from '../dtos/AddImageByAdminUseCaseParams';

@Injectable()
export class MockAddImageByAdminUseCaseImpl implements AddImageByAdminUseCase {
  public constructor(private readonly loggerProvider: LoggerProvider) {}

  public async execute({
    image,
    description,
  }: AddImageByAdminUseCaseParams): Promise<AddImageByAdminResponseDto> {
    this.loggerProvider.setContext('mockAddImageByAdmin');

    return { id: '628b5a5252479399b2f89dda' };
  }
}
