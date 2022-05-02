import { Injectable } from '@nestjs/common';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { AdminRepository } from '../../../repositories/admin/AdminRepository';
import { RegisterAdminResponseDto } from './dtos/RegisterAdminResponseDto';
import { RegisterAdminUseCaseParams } from './dtos/RegisterAdminUseCaseParams';
import { RegisterAdminUseCase } from './RegisterAdminUseCase';

@Injectable()
export class RegisterAdminUseCaseImpl implements RegisterAdminUseCase {
  public constructor(
    private readonly _adminRepository: AdminRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    id,
    password,
  }: RegisterAdminUseCaseParams): Promise<RegisterAdminResponseDto> {
    this._logger.setContext('registerAdmin');

    await this._adminRepository.save(id, password);

    return {};
  }
}
