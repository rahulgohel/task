import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, type: String })
  @Length(8, 10)
  password: string;
}

export class verifyUserDto {
  @ApiProperty({ required: true, type: String })
  @IsString()
  otp: string;
}
