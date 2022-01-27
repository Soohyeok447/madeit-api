import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RoutineService } from '../RoutineService';
import { RoutineRepository } from '../../../../repositories/routine/RoutineRepository';
import { UserRepository } from '../../../../repositories/user/UserRepository';
import { ImageRepository } from '../../../../repositories/image/ImageRepository';
import { ImageProvider } from '../../../../providers/ImageProvider';

@Injectable()
export class RoutineServiceImpl implements RoutineService {
  constructor(
    private readonly routineRepository: RoutineRepository,
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
    private readonly imageProvider: ImageProvider,
  ) {}
}
