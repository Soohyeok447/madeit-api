import { Injectable } from '@nestjs/common';
import { mainVersion } from '../../../ApiVersion';

export interface GetMainVersionResponse {
  mainVersion: string
}

@Injectable()
export class VersionController {
  constructor(

  ) { }

  getMainVersion(
  ): GetMainVersionResponse {
    return {
      mainVersion
    };
  }
}
