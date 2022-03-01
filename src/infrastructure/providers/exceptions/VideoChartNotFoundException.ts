import { NotFoundException } from '../../../domain/common/exceptions/NotFoundException';

export class VideoChartNotFoundException extends NotFoundException {
  constructor() {
    super('youtube에서 video chart를 찾을 수 없음', 2);
  }
}
