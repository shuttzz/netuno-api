import { IsNotEmpty, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Código é obrigatório' })
  @MinLength(6, { message: 'Código precisa ter 6 caracteres' })
  @MaxLength(6, { message: 'Código precisa ter 6 caracteres' })
  code: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha precisa ter ao menos 8 caracteres' })
  password: string;

  @ValidateIf((object) => object.password !== null)
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatório' })
  passwordConfirmation: string;
}
