import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestSerialRequestDto {
  @ApiProperty({
    description: `
      이메일`,
    example: 'develife.corp@gmail.com',
  })
  @IsEmail()
  public readonly email: string;
}
