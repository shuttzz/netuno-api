import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(5, { message: 'Nome precisa ter ao menos 5 caracteres' })
  @MaxLength(100, { message: 'Nome não pode ter mais que 100 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @MaxLength(150, { message: 'E-mail não pode ter mais que 150 caracteres' })
  @IsEmail()
  email: string;

  keepImage: string;

  password?: string;
}
