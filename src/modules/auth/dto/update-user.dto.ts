import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(5, { message: 'Name must be at least 5 characters long' })
  @MaxLength(100, { message: 'Name cannot be longer than 100 characters' })
  name: string;

  @IsNotEmpty({ message: 'E-mail is required' })
  @MaxLength(150, { message: 'Email cannot be longer than 150 characters' })
  @IsEmail()
  email: string;

  keepImage: string;

  password?: string;
}
