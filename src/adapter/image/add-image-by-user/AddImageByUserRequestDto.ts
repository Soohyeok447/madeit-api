import { ApiProperty } from '@nestjs/swagger';

export class AddImageByUserRequestDto {
  @ApiProperty({
    description: `
      이미지`,
  })
  public readonly image: Express.Multer.File;

  public readonly buffer?: any;
  public readonly mimetype?: any;
}
