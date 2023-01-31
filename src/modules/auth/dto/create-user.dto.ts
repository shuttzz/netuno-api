import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  id?: string;

  @IsNotEmpty({ message: 'Name é obrigatório' })
  @MinLength(5, { message: 'Nome precisa ter ao menos 5 caracteres' })
  @MaxLength(100, { message: 'Nome não pode ter mais que 100 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @MaxLength(150, { message: 'E-mail não pode ter mais que 150 caracteres' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha precisa ter ao menos 8 caracteres' })
  password: string;

  @ValidateIf((object) => object.password !== null)
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatório' })
  passwordConfirmation: string;

  avatarUrl: string;

  avatarKey: string;

  active: boolean;

  firebaseToken: string;
}
