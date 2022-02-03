import {
  Injectable,
} from '@nestjs/common';
import { UserCommonService } from '../UserCommonService';
import { RoutineRepository } from '../../../../repositories/routine/RoutineRepository';
import { UserRepository } from '../../../../repositories/user/UserRepository';
import { ImageRepository } from '../../../../repositories/image/ImageRepository';
import { ImageProvider } from '../../../../providers/ImageProvider';
import { UserNotAdminException } from '../exceptions/UserNotAdminException';

@Injectable()
export class UserCommonServiceImpl implements UserCommonService {
  constructor(
    // private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
    // private readonly _imageRepository: ImageRepository,
    // private readonly _imageProvider: ImageProvider,
  ) { }

  public async validateAdmin(userId: string): Promise<void> {  
    const user = await this._userRepository.findOne(userId);
    
    const isAdmin = user['is_admin'] ?? null;

    if (!isAdmin) {
      throw new UserNotAdminException();
    }
  }
}
