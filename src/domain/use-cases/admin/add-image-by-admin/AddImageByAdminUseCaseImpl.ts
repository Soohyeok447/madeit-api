import { Injectable } from '@nestjs/common';
import { LoggerProvider } from 'src/domain/providers/LoggerProvider';
import { AddImageByAdminResponseDto } from './dtos/AddImageByAdminResponseDto';
import { AddImageByAdminUseCaseParams } from './dtos/AddImageByAdminUseCaseParams';
import { AddImageByAdminUseCase } from './AddImageByAdminUseCase';
import { AdminRepository } from '../../../repositories/admin/AdminRepository';
import { Admin } from '../../../entities/Admin';
import {
  AdminAuthProvider,
  Payload,
} from '../../../providers/AdminAuthProvider';
import { AdminNotFoundException } from '../common/exceptions/AdminNotFoundException';
import { InvalidAdminTokenException } from '../common/exceptions/InvalidAdminTokenException';
import { ImageV2 } from '../../../entities/ImageV2';
import { ImageRepositoryV2 } from '../../../repositories/imageV2/ImageRepositoryV2';

@Injectable()
export class AddImageByAdminUseCaseImpl implements AddImageByAdminUseCase {
  public constructor(
    private readonly loggerProvider: LoggerProvider,
    private readonly adminRepository: AdminRepository,
    private readonly adminAuthProvider: AdminAuthProvider,
    private readonly imageRepositoryV2: ImageRepositoryV2,
  ) {}

  public async execute({
    image,
    description,
    accessToken,
  }: AddImageByAdminUseCaseParams): Promise<AddImageByAdminResponseDto> {
    this.loggerProvider.setContext('addImageByAdmin');

    const payload: Payload =
      this.adminAuthProvider.verifyAccessToken(accessToken);

    if (!payload)
      throw new InvalidAdminTokenException(
        this.loggerProvider.getContext(),
        `유효하지않은 어드민 토큰입니다.`,
      );

    const admin: Admin = await this.adminRepository.findOneByIndentifier(
      payload.id,
    );

    if (!admin)
      throw new AdminNotFoundException(
        this.loggerProvider.getContext(),
        `존재하지 않는 어드민`,
      );

    const newImage: ImageV2 = await this.imageRepositoryV2.save({
      buffer: image.buffer,
      mimetype: image.mimetype,
      description,
    });

    return { id: newImage.id };
  }
}
