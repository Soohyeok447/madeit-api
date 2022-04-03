import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { apiVersion } from '../../../ApiVersion';

export class GetMainVersionResponse {
  @ApiProperty({
    example: 'v1.0.0',
  })
  public readonly mainVersion: string;
}

@Injectable()
export class VersionController {
  public getMainVersion(): GetMainVersionResponse {
    return {
      mainVersion: apiVersion,
    };
  }
}
