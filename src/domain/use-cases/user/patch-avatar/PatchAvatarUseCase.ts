import { UseCase } from '../../UseCase';
import { PatchAvatarResponse } from '../response.index';
import { PatchAvatarUseCaseParams } from './dtos/PatchAvatarUseCaseParams';

/**
 * 유저 프로필 이미지 수정
 *
 * 프로필 사진 수정, 삭제 가능
 */
export abstract class PatchAvatarUseCase
  implements UseCase<PatchAvatarUseCaseParams, PatchAvatarResponse>
{
  abstract execute(params: PatchAvatarUseCaseParams): PatchAvatarResponse;
}
